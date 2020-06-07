import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import { celebrate, Joi} from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();
/*
routes.get('/', (request, response) => {
    return response.json({ messade: "E aew negada!"});

});
*/
routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);

routes.post(
    '/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }), 
    pointsController.create);


/*
app.get('/users', (request, response) => {
    console.log('Listar de Usuários por query');
    const search = String(request.query.search);
   
    const filteredUsers = search === 'undefined' ? users : users.filter(user => user.includes(search)); //users n ta retornando
    return response.json(filteredUsers);

});

app.get('/users/:id', (request, response) => {
    console.log('Listar de Usuário por ID');
    
    const id = Number(request.params.id);
    //JSON
    const user = users[id];

    return response.json(user);

});

app.post('/users', (request, response) => {
    console.log('Cadastrar de Usuário');
    const data = request.body;
    console.log(data);
    const user = {
        name: data.name,
        email: data.email
    };
    return response.json(user);
});
*/

export default routes;