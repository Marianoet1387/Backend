const { Router } = require('express')

const router = Router()

router.get('/', (_, res) => {
           
    res.render('chat', {
        title:"App de chat",
        useWS: true,
        useSweetAlert: true,
        scripts:[
            "chat.js"
        ]
    })
})

module.exports = router