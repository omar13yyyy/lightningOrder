import {app} from './app';
function server(){
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
}


export default server