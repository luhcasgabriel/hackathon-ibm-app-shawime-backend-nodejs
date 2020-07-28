const Message = require('../models/Message');
const User = require('../models/User');

module.exports = {
    async information(req, res){
        const { description } = req.body;
        const { time } = req.body;

        // Headers para enviar contexto de autenticação
        const { user_id } = req.headers;
        const { group_id } = req.headers;

        //Verificação para ver se o ID é existente, ao contrário volta erro
        const user = await User.findById(user_id);

        if (!user){
            return res.status(400).json({ error: 'User does not exists' });
        }

        const message = await Message.create({
            user: user_id,
            description,
            time: Date.now(),
            group: group_id
        })

        return res.json(message);
    }
};