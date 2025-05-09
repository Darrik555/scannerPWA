import jwt from 'jsonwebtoken';
// DONT USE THIS CODE
const SECRET = process.env.JWT_SECRET ?? "";

const corsHeaders = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type':'application/json'
};

export async function OPTIONS(){
    return new Response(null,{
    status:204,headers:corsHeaders
});
}

export async function GET({url}){
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
    
        const token = jwt.sign({role}, SECRET, {expiresIn: '20m'})
    
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