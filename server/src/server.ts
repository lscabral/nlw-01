import express from 'express';
import cors from 'cors';
import routes from './routes'
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
//Rota: url completo da requisição
//Recurso: entidade na qual estamos acessand    o

//GET: buscar informação/ões no backend
//POST: criar uma nova informação no backend
//PUT: Atualizar informação existente no backend 
//DELETE: Remover uma informação do backend

//Exemplos:

// POST http://localhost:3333/users = criar um usuário
// GET http://localhost:3333/users = listar usuários
// GET http://localhost:3333/users/5 = listar um usuário ID 5

//Request Param: parametros na propria rota q id um recurso (obr)
//Query Param: parametros na propria rota q id um recurso (opc) para filtros e paginação
//Request body: parametros para criação e atualização de informação

//select * from users where name = 'Luciano'
//knex('users').where('name','Luciano').select('*')

/*
const users = [
    'Luciano', //0
    'Lucca', //1
    'Teteu', //2
    'Lala'//3
];
*/
app.get('/', (request, response) => {
    return response.json({ message: "E aew negada!"});

});


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
app.use(errors());

app.listen(3333);