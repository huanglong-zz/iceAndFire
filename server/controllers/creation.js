import creation as api from '../api'
import crypto from 'crypto'

export async function create(ctx, next) {
  const body = ctx.request.body
  const user = ctx.session.user
  const serverId = body.serverId
  const house = body.house

  api.uploadAvatarToCloudinary(serverId, user.avatar)

  let creation = new Creation({
    user: user._id,
    sex: user.sex,
    serverId: serverId
  })

  await creation.save()

  ctx.body = {
    creation: creation._id
  }
}

function md5(creation, house, constellation) {
  const {
    nickname,
    age,
  } = creation.age
  
  const secret = nickname + age + house + constellation
  const hash = crypto.createHash('md5')

  hash.update(secret)
  
  return hash.digest('hex')
}

function pick() {
  const stuff = {
    'Wolf': ['艾丽娅.史塔克', '北境之外的你哇哇哇']
  }

  return stuff['Wolf']
}

// 测试结果生成卡片
export async function guess(ctx, next) {
  const body = ctx.request.body
  const creationId = ctx.request.creationId

  let creation = await Creation.findOne({
    _id: creationId
  }).exec()

  // 926905346f36e87b074205bfcade0854
  creation.factor = md5(creation, body.house, body.constellation)
  creation.house = body.house
  creation.constellation = body.constellation
  creation = await creation.save()

  const stuff = pick()
  const base = 'http://res.cloudinary.com/demo/image/upload/'
  const nickname = creation.nickname + '.' + stuff[0]
  const ending = stuff[1]
  const public_id = 
  const url = base + 'y_30,a_2,g_east,l_text:impact_18_bold:' + nickname + '/w_500,y_230,a_2,h_150,g_north,c_fit,l_text:Arial_20:' + ending + '/flowers.jpg'

  api.combineAvatarOnCloudinary({id: creation._id})

  ctx.body = {
    creation: creation._id
  }
}





