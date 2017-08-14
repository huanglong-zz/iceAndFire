const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TicketSchema.statics = {
  async getTicket () {
    const ticket = await this.findOne({ name: 'ticket' }).exec()

    return ticket
  },

  async saveTicket (data) {
    let ticket = await this.findOne({ name: 'ticket' }).exec()
    if (ticket) {
      ticket.ticket = data.ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'ticket',
        expires_in: data.expires_in,
        ticket: data.ticket
      })
    }

    try {
      await ticket.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
