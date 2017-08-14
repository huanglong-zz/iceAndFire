import rp from 'request-promise'
import cheerioAdv from 'cheerio-advanced-selectors'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import Promise from 'bluebird'
import R from 'ramda'
import { resolve } from 'path'
import qiniu from '../libs/qiniu'
import randomToken from 'random-token'

const cheerio = cheerioAdv.wrap(require('cheerio'))
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
const fetchImage = qiniu.fetchImage
// 1.狼——史塔克家族，临冬城骁勇善战的家族，现任首领是北境之王罗伯特·史塔克。
// 2.鹰——艾林家族，血统最纯正的安达尔贵族后代，罗伯特的母亲是艾琳家族人。
// 3.鱼——徒利家族，三叉戟河流域的特首。
// 4.乌贼——葛雷乔伊家族，自称海岛上的铁民，强盗家族。
// 5.狮子——兰尼斯特家族，富可敌国，电视剧里势力最强大的家族。
// 6.鹿——拜拉席恩家族，目前是七国王位的掌权家族。
// 7.玫瑰——提利尔家族。
// 8.太阳——马泰尔家族
// 9.龙——坦格利安家族

// http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=67
const jsonPath = path => resolve(__dirname, '../database/json/', path)

const houseUrl = 'http://zh.asoiaf.wikia.com/wiki/'
const HOUSES = [
  {
    name: 'House Stark of Winterfell',
    cname: '史塔克家族',
    words: 'Winter is Coming'
  },
  {
    name: 'House Targaryen',
    cname: '坦格利安家族',
    words: 'Fire and Blood'
  },
  {
    name: 'House Lannister of Casterly Rock',
    cname: '兰尼斯特家族',
    words: 'Hear Me Roar!'
  },
  {
    name: 'House Arryn of the Eyrie',
    cname: '艾林家族',
    words: 'As High as Honor'
  },
  {
    name: 'House Tully of the Riverrun',
    cname: '徒利家族',
    words: 'Family, Duty, Honor'
  },
  {
    name: 'House Greyjoy of Pyke',
    cname: '葛雷乔伊家族',
    words: 'We Do Not Sow'
  },
  {
    name: "House Baratheon of Storm's End",
    cname: '风息堡的拜拉席恩家族',
    words: 'Ours is the Fury'
  },
  {
    name: 'House Tyrell of Highgarden',
    cname: '提利尔家族',
    words: 'Growing Strong'
  },
  {
    name: 'House Nymeros Martell of Sunspear',
    cname: '马泰尔家族',
    words: 'Unbowed, Unbent, Unbroken'
  }
]

const d = []

const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text)

  if (item.elements && item.elements.length) {
    let _acc = normalizedContent(item.elements)
    acc = R.concat(acc, _acc)
  }
  return acc
}, [])


const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(
    i => ({
      level: i.level,
      title: i.title,
      content: normalizedContent(i.content)
    })
  )
)

/**
 * 拿到每份数据的 wikiId
 */
const getWikiId = async data => {
  let query = data.cname || data.name
  const url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(query)}`

  try {
    var res = await rp(url)
  } catch (e) {
    console.log('error:', e)
  }

  res = JSON.parse(res)
  res = res.items[0]

  console.log(query, ':', res.id, res.title)
  return R.merge(data, res)
}

/**
 * wiki 上返回的数据格式化
 */
const getWikiDetail = async data => {
  const { id } = data
  let url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`

  try {
    var res = await rp(url)
  } catch (e) {
    console.log('error:', e)
  }
  res = JSON.parse(res)
  console.log(id, 'done')

  const getCnameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content)
    }),
    R.pick(['title', 'content']),
    R.nth(0),
    R.filter(R.propEq('level', 1)),
    R.prop('sections')
  )

  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )

  let cnameAndIntro = getCnameAndIntro(res)
  let sections = getLevel(res)
  let _res = R.merge(data, getCnameAndIntro(res))

  sections = normalizedSections(sections)

  _res.sections = sections
  _res.wikiId = id

  return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], _res)
}


/**
 * 根据 IMDb.json 这份数据，爬 wiki 上的人物数据，并且整合
 */
export const getWikiCharacters = async IMDbCharacters => {
  let data = R.map(getWikiId, IMDbCharacters)

  data = await Promise.all(data)

  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)

  writeFileSync(jsonPath('wikiCharacters.json'), JSON.stringify(data, null, 4), 'utf8')

  return data
}

/**
 * 从 wiki 上获取家族数据
 */
export const getHouses = async () => {
  let data = R.map(getWikiId, HOUSES)
  data = await Promise.all(data)
  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)

  writeFileSync(jsonPath('wikiHouses.json'), JSON.stringify(data, null, 4), 'utf8')
}

/**
 * 把家族成员的数据整理出来
 */
export const getSwornMembers = async () => {
  let houses = require(jsonPath('wikiHouses.json'))
  let characters = require(jsonPath('wikiCharacters.json'))

  const findSwornMembers = R.map(R.compose(
    i => _.reduce(i, (acc, item) => {
      acc = acc.concat(item)

      return acc
    }, []),
    R.map(i => {
      let item = R.find(R.propEq('cname', i[0]))(characters)
      return {character: item.nmId, text: i[1]}
    }),
    R.filter(item => R.find(R.propEq('cname', item[0]))(characters)),
    R.map(i => {
      let item = i.split('，')
      let name = item.shift()

      return [name.replace(/(【|】|爵士|一世女王|三世国王|公爵|国王|王后|夫人|公主|王子)/g, ''), item.join('，')]
    }),
    R.nth(1),
    R.splitAt(1),
    R.prop('content'),
    R.nth(0),
    R.filter(i => R.test(/伊耿历三世纪末的/, i.title)),
    R.prop('sections')
  ))

  let swornMembers = findSwornMembers(houses)

  houses = _.map(houses, (item, index) => {
    item.swornMembers = swornMembers[index]
    return item
  })
  // console.log(houses)
  writeFileSync(jsonPath('wikiHouses.json'), JSON.stringify(houses, null, 4), 'utf8')
}


/**
 * 将 IMDb 上原始的封面以及剧照，上传到七牛上
 */
export const fetchImagesFromA2Q = async () => {
  let IMDbCharacters = require(jsonPath('wikiCharacters.json'))

  IMDbCharacters = R.map(async item => {
    let key = `${item.name}/${randomToken(32)}`
    await fetchImage(item.profile, key)

    item.profile = key

    for (let i = 0; i < item.images.length; ++i) {
      let _key = `${item.name}/${randomToken(32)}`
      try {
        await fetchImage(item.images[i], _key)
      } catch (e) {
        item.images.splice(i, 1)
      }
      await sleep(100)

      item.images[i] = _key
    }

    return item
  })(IMDbCharacters)

  IMDbCharacters = await Promise.all(IMDbCharacters)
  console.log('fetchImagesFromA2Q done')
  writeFileSync(jsonPath('wikiCharacters.json'), JSON.stringify(IMDbCharacters, null, 4), 'utf8')
}


// getHouses()
// getSwornMembers()
// fetchImagesFromA2Q()
