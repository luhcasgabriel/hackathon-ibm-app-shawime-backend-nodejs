const Group = require('../models/Group');
const User = require('../models/User');
const Hashtag = require('../models/Hashtag');
const { hash } = require('bcryptjs');

module.exports = {
    async create(req, res){
        try{
            const { filename } = req.file;
            const { title, description, participants} = req.body;
            // Headers para enviar contexto de autenticação
            const { hashtag_id } = req.headers;
            
            const group = await Group.create({
                user: req.userId,
                picture: filename,
                title,
                description,
                hashtag: hashtag_id,
                participants
            })
            return res.json(group);
        } catch (err){
            return res.status(400).send( { error: 'Erro para cadastro de sala, tente novamente'} )
        }
    },

    async update(req, res){
        try{
            const { filename } = req.file;
            const { title, description, participants} = req.body;
            // Headers para enviar contexto da alteração
            const { user_id } = req.headers;
            const { hashtag_id } = req.headers;

        //Verificação para pegar campo id do usúario e dar update
            const room = await Group.findByIdAndUpdate(req.params.groupId, { 
                picture: filename,
                title, 
                description,
                participants,
        }, { new: true });

        return res.json(room);

        } catch (err){
            return res.status(400).send( { error: 'Erro para atualizar informações da sala'} )
        }
    },

    async index(req, res){
        try{
            const group = await Group.find().populate(['user', 'hashtag']);

            return res.json(group)
        } catch (err){
            return res.status(400).send( { error: 'Erro para listar todas as salas'} )
        }

    },

    async indexByGroupId(req, res){
        try{
            const group = await Group.findById(req.params.groupId).populate(['user', 'hashtag']);

            return res.json(group)
        } catch (err){
            console.log(err);
            return res.status(400).send( { error: 'Erro para listar a sala por ID do Grupo'} )
        }
    },

    async delete(req, res){
        try{
            const group = await Group.findByIdAndRemove(req.params.groupId);

            return res.send();
        } catch (err){
            return res.status(400).send( { error: 'Erro ao deletar sala, tente novamente mais tarde'} )
        }        
    },

    async indexByHashtagId(req, res){
        try{
            const { hashtag } = req.body;

            const byhash = await Group.find({ hashtag: hashtag }).populate(['user', 'hashtag']);

            return res.json(byhash);
        } catch (err){
            return res.status(400).send( { error: 'Erro para listar todas as sala por ID do Hashtag'} )
        }
    },
};