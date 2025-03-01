import { GET } from './api/image.ts';

const req = new Request(new URL('localhost:3000?width=400&height=300'));

console.log(await GET(req));