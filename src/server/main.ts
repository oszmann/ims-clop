import express , { Request, Response } from 'express';
import path from 'path';

// -------------------firing express app
const app = express();
app.use(express.json());
//app.use(express.urlencoded({extended:false}));
app.use('/', express.static(path.join(process.cwd(), "public")));
app.use('/js', express.static(path.join(process.cwd(), "dist", "client")));



// -------------------routes
app.get('/home', (request: Request, response: Response)=>{
  console.log(request.url)
  response.json({ message: `a!` })
});


// --------------------Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log(`Server running on  http://localhost:${ PORT }`);
});
console.log("Hello World!");