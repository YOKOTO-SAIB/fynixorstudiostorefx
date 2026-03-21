const KEY='otp_jGUtSJRtECCcPqsr';
const BASE='https://www.rumahotp.com/api';
const EP={services:'/v2/services',countries:'/v2/countries',operators:'/v2/operators',order:'/v2/orders',status:'/v1/orders/get_status',balance:'/balance'};
module.exports=async function(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Content-Type','application/json');
  if(req.method==='OPTIONS')return res.status(200).end();
  const{action,...q}=req.query;
  if(!action||!EP[action])return res.status(400).json({success:false,message:'Invalid action'});
  const qs=new URLSearchParams(q).toString();
  try{
    const r=await fetch(BASE+EP[action]+(qs?'?'+qs:''),{headers:{'x-apikey':KEY,'Accept':'application/json'}});
    const d=await r.json();
    return res.status(200).json(d);
  }catch(e){return res.status(500).json({success:false,message:e.message});}
};