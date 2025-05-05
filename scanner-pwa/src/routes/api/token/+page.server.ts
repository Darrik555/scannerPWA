import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
// DONT USE THIS CODE
const SECRET = 'secret';

export const actions: RequestHandler = async({url}) => {
    const role = url.searchParams.get('role');

    if(!role){
        return new Response(JSON.stringify({error: 'Missing role'}),
    { 
        headers:{
        'Access-Control-Allow-Origin':'*',
        'Content-Type':'application/json'},
    });
    }

    const token = jwt.sign({role},SECRET,{expiresIn: '20m'})

    return new Response(JSON.stringify({token}), 
    { 
        headers:{
        'Access-Control-Allow-Origin':'*',
        'Content-Type':'application/json'},
    });
};