/*import jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token');
    if(!token){
        return { role: null };
    }

    try{
        const decoded = jwt.verify(token,'secret') as {role: string};
        return {role: decoded.role};
    }catch(e){
        return {role: null};
    }
}

*/