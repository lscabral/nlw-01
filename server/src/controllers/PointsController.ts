import knex from '../database/connection';
import {Request, Response} from 'express';

//create, index, show, update, delete

class PointsController {

    async show(request: Request, response: Response) {
        //console.log('Listar Ponto de Coleta por ID'); //OK
        
        const {id} = request.params;
        const point = await knex('points').where('id', id).first();

        if (!point)
            return response.status(400).json({ message: 'Point not found.'});

        const serializedPoint = {
                ...point,
                image_url: `http://192.168.0.16:3333/uploads/${point.image}`,
        };

        const items = await knex('items')
        .join('point_items', 'items.id','=','point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title')
        //select * from items join point_items on items.id = point_items_item.id where point_items.point_id = id
        //console.log('OK!');
        return response.json({point: serializedPoint, items});
        
    }
    
    async index(request: Request, response: Response) {
        //console.log('Listar Pontos de coleta'); //rever
        //com filtros
        const {city, uf, items } = request.query;
        //console.log(city, uf, items); //ok
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points').
        join('point_items', 'points.id','=','point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        const serializedPoints =  points.map (point => {
            return {
                ...point,
                image_url: `http://192.168.0.16:3333/uploads/${point.image}`
            }
        });
    /*
        const serializedItems = points.map(point => {
            return {
                id: point.id,
                image:point.image,
                name: point.name, 
                email: point.email, 
                whatsapp: point.whatsapp, 
                latitude: point.latitude, 
                longitude: point.longitude, 
                city: point.city, 
                uf: point.uf,
                items: point.items
            }
        });*/
        //console.log("ok");
        return response.json( serializedPoints );
    }
    async create (request: Request, response: Response) {
        //console.log('Cadastrar Pontos de Coleta'); //OK
        const {
            name, 
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city, 
            uf, 
            items
        } = request.body;
    
        const trx = await knex.transaction();
        console.log('after_trx');
        const point = {
            image: request.file.filename,
            name, 
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city, 
            uf
        };
        //console.log(data);
        const insertedIds = await trx('points').insert(point);
        console.log('after_trx_insert_point');
        const point_id = insertedIds[0];
        const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        });
        await trx('point_items').insert(pointItems)
        await trx.commit();
        //console.log('OK!');

        return response.json({
            id: point_id,
            ... point, 
        });
    }
}

export default PointsController;