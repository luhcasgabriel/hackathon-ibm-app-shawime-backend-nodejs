const Hashtag = require('../models/Hashtag');

module.exports = {
    async indexbyId(req, res){
        try{
            const hashtag = await Hashtag.findById(req.params.hashtagId);

            return res.json(hashtag)
        } catch (err){
            return res.status(400).send( { error: 'Erro para listar as hashtags por ID'} )
        }
    },

    async create(req, res){
        try{    
            const { theme, description} = req.body;

            const hash = await Hashtag.create({
                theme, 
                description
            });

            return res.json(hash);
        } catch (err){
            return res.status(400).send( { error: 'Erro para cadastrar as hashtags'} )
        }
    }, 

    async index(req, res){
        try{
            const hashtag = await Hashtag.find();

            return res.json(hashtag)
        } catch (err){
            return res.status(400).send( { error: 'Erro para listar as hashtags'} )
        }
    },
    
    async delete(req, res){
        try{
            const hashtag = await Hashtag.findByIdAndRemove(req.params.hashtagId);

            return res.send();
        } catch (err){
            return res.status(400).send( { error: 'Erro ao deletar Hashtag, tente novamente mais tarde'} )
        }        
    }
};