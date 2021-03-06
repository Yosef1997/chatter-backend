const chatModel = require('../models/chat')
const response = require('../helpers/response')

exports.createChat = async (req, res) => {
  try {
    const data = req.body
    const chatData = {
      sender: req.userData.id,
      receiver: data.receiver,
      message: data.message
    }

    const creatChat = await chatModel.createChat(chatData)
    if (creatChat.affectedRows > 0) {
      return response(res, 200, true, 'Chat send', creatChat[0])
    } else {
      return response(res, 400, false, 'Chat not send')
    }
  } catch (error) {
    return response(res, 500, false, 'Bad Request')
  }
}

exports.listChat = async (req, res) => {
  try {
    const id = req.userData.id
    const initialResults = await chatModel.getAllChat(id)
    if (initialResults.length > 0) {
      const key = 'name'
      const arrayUniqueByKey = [...new Map(initialResults.map(item =>
        [item[key], item])).values()]
      return response(res, 200, true, 'All chat', arrayUniqueByKey)
    } else {
      return response(res, 400, false, 'Data chat not found')
    }
  } catch (error) {
    console.log(error)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.detailChat = async (req, res) => {
  try {
    const sender = req.userData.id
    const { id } = req.params
    const results = await chatModel.detailChat(id, sender)
    if (results.length > 0) {
      return response(res, 200, true, results)
    } else {
      return response(res, 400, false, 'Detail chat not found')
    }
  } catch (error) {
    console.log(error)
    return response(res, 500, false, 'Bad Request')
  }
}

exports.deleteChat = async (req, res) => {
  try {
    const { receiver } = req.body
    const { message } = req.body
    const sender = req.userData.id
    const deleteChat = await chatModel.deleteChat(receiver, message, sender)
    console.log(deleteChat)
    if (deleteChat) {
      return response(res, 200, true, 'Message deleted')
    } else {
      return response(res, 400, false, 'Delete message failed')
    }
  } catch (error) {
    console.log(error)
    return response(res, 400, false, 'Bad Request')
  }
}
