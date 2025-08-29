import {app,wsServer} from './app';
function server(){
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
}





const wsPORT: number = parseInt(process.env.WEB_SOCKET_PORT || '8002');

wsServer.listen(4000, () => 
    console.log(`Web socket running on port ${wsPORT}`)
);
export default server