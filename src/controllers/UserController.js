const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const authConfig = require('../config/auth');


//Função de envio de e-mail para confirmação de conta
async function submit_account(user){        
    try{
        const token = crypto.randomBytes(20).toString('hex');

        await User.findByIdAndUpdate( user._id, {
            '$set': {
                accountToken: token,
            }
        });

        mailer.sendMail({
            to: user.email,
            from: 'visitantesilvapc@gmail.com',
            template: './submit_account',
            context: { token, id: user._id},
        }, (err) => {
            if (err){
                return res.status(400).send( { error: 'Não foi possível enviar o e-mail para cadastrar a conta, tente novamente'})
            }

            console.log(user);
            return res.status(201).send("E-mail enviado com sucesso");
        });
        

    } catch (err){
        res.status(400).send( { error: 'Erro para cadastrar conta, tente novamente' } )
    }
};

module.exports = {

    // Listar todos os usuários
    async index(req, res){
        try{
            const user = await User.find();

            return res.json(user)
        } catch (err){
            return res.status(400).send( { error: 'Erro ao listar todos os usuários'} )
        } 
    },

    // Listar o usúario por ID
    async indexID(req, res){
        try{
            const user = await User.findById(req.body);
    
            return res.send({user});
        }catch (err){
            return res.status(400).send({ error: 'Erro ao listar os usuário por ID'});
        }
        
    },

    /**
     * Função para criação de usuário
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async create(req, res){
        try{
            const { fullname, email, username, password, state, country, help} = req.body;
            const { filename } = req.file;

            //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
            let user = await User.findOne( { email } );

            //Caso já exista um e-mail cadastrado ele irá responder status 400
            if(user){
                return res.status(400).send( { error: 'Usuário já existe'} )
            }

            //Verificação para ver se e-mail já está cadastrado, caso não foi irá entrar no if
            if(!user){
                user = await User.create({
                    fullname, 
                    email, 
                    username, 
                    password, 
                    state, 
                    country, 
                    picture: filename, 
                    help
                });
        };

        submit_account(user);

        return res.json(user);

        } catch (err){
            return res.status(400).send( { error: 'Erro ao criar usuário'} )
        }         
    },

    //Função para atualizar o statusAccount (Confirmação por e-mail)
    async update_statusAccount(req, res){
        const { user_id, token } = req.body;

        try{
            const user = await User.findById( { _id: user_id }).select('+accountToken');

            if(!user){
                return res.status(400).send( { error: 'Usuário não encontrado' } )
            }

            if (token !== user.accountToken){
                return res.status(400).send( { error: 'Token Inválido' } )
            }

            user.statusAccount = 1;

            await user.save();

            res.send();

        } catch (err){
            res.status(400).send( { error: "Não é possível resetar a senha, tente novamente mais tarde"} )
        }

    },    

    // Atualização do cadastro
    async update(req, res){
        try{
            const { fullname, email, username, password, state, country, help} = req.body;
            const { picture } = req.file;

            //Se ele encontrar um usúario com este e=mail ele vai salvar no user 
            let user = await User.findOne({email});

            //Verificação para ver se o e-mail já está cadastrado, se existir faz a atualização
            if(user){
                user = await User.update({
                    fullname,
                    email, 
                    username, 
                    password, 
                    state, 
                    country, 
                    picture, 
                    help
                });
            };
            return res.json(user);
        }catch (err){
            return res.status(400).send({ error: 'Erro ao atualizar os dados do usuário'});
        }    
    },

    //destroy
    async delete(req, res){
        try{
            const {id} = req.body

            let user = await User.deleteOne({ _id : id })
    
            return res.json(user)
        } catch (err){
            return res.status(400).send( { error: 'Erro ao deletar usuário'} )
        }
    },

    //autenticação
    async authenticate(req, res){
        const { email, password } = req.body; 

        const user = await User.findOne( { email } ).select('+password');

        if (!user){
            return res.status(400).send( { error: 'Usuário não encontrado'});
        }

        if (user.statusAccount == 2){
            return res.status(400).send( { error: 'Usuário não confirmado, por favor verificar e-mail'});
        }
        
        //Comparando para ver se a senha que o usuário digitou é a mesma que a do banco de dados. Await por que é uma função assincrona
        if(await bcrypt.compare(password, user.password)){
            return res.status(400).send( { error: 'Senha Inválida'});
        }

        //Para não voltar a senha
        user.password = undefined;

        // TODO: Token para 1 dia
        const token = jwt.sign( { id: user._id }, authConfig.secret,  {
            expiresIn: 86400,
        });

        res.send( { user, token } );
        
    },

    /**
     * Função de envio de e-mail de esqueci senha
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async forgot_password(req, res){
        const { email } = req.body;

        try{
            const user = await User.findOne( { email });

            if(!user){
                return res.status(400).send( { error: 'Usuário não encontrado' } )
            }

            const token = crypto.randomBytes(20).toString('hex');
            
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate( user._id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });

            mailer.sendMail({
                to: email,
                from: 'visitantesilvapc@gmail.com',
                template: './forgot_password',
                context: { token },
            }, (err) => {
                if (err){
                    return res.status(400).send( { error: 'Não foi possível enviar o e-mail de esqueci a senha, tente novamente'})
                }

                return res.status(201).send("E-mail enviado com sucesso");
            });

        } catch (err){
            res.status(400).send( { error: 'Erro em esqueci a senha, tente novamente' } )
        }
    },

    /**
     * Função para resetar a senha
     * @param {*usuario} req 
     * @param {*usuario} res 
     */
    async reset_password(req, res){
        const { email, token, password } = req.body;

        try{
            const user = await User.findOne( { email }).select('+passwordResetToken passwordResetExpires');

            if(!user){
                return res.status(400).send( { error: 'Usuário não encontrado' } )
            }

            if (token !== user.passwordResetToken){
                return res.status(400).send( { error: 'Token Inválido' } )
            }

            const now = new Date();

            if (now > user.passwordResetExpires){
                return res.status(400).send( { error: 'Token expirado, tente novamente' } )
            }

            user.password = password;

            await user.save();

            res.send();

        } catch (err){
            res.status(400).send( { error: "Não é possível resetar a senha, tente novamente mais tarde"} )
        }

    }

}; // teste