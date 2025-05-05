import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
// DONT USE THIS CODE
const SECRET = 'secret';

const corsHeaders = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type':'application/json'
};




export const actions: RequestHandler = async({url}) => {
    try{
        const role = url.searchParams.get('role');

        if(!role){
            return new Response(JSON.stringify({
                    error: 'Missing role'}),
                { 
                    status: 400,
                    headers: corsHeaders
                });
        }
    
        const token = jwt.sign({role},SECRET,{expiresIn: '20m'})
    
        return new Response(JSON.stringify({token}), 
        { 
            status: 200,
            headers:corsHeaders
        });
    }catch(e){
        return new Response(JSON.stringify({error:'Server errror'}), 
        { 
            status: 500,
            headers:corsHeaders
        });  
    }
   
};