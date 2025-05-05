import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const SECRET = 'secret';

export const actions: RequestHandler = async({url}) => {
    const role = url.searchParams.get('role');

    if(!role){
        return new Response(JSON.stringify({error: 'Missing role'}),{status: 400});
    }

    const token = jwt.sign({role},SECRET,{expiresIn: '20m'})

    return new Response(JSON.stringify({token}), { headers:{'Content-Type':'application/json'},});
};