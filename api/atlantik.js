const KEY='cxQBTDEaLJ2GSYzNjIO3AETWQyxQc3UzduMbtzvujl5oBNBELkgo3tzV6MfVYgFEq5Z5XOmGO8MVH0uI58wLkz4yN1oaeImDUt7L';
const BASE='https://atlantich2h.com';
const EP={create:'/deposit/create',status:'/deposit/status',cancel:'/deposit/cancel',methods:'/deposit/metode'};
module.exports=async function(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Content-Type','application/json');
  if(req.method==='OPTIONS')return res.status(200).end();
  const{action,...q}=req.query;
  if(!action||!EP[action])return res.status(400).json({status:false,message:'Invalid action'});
  const params=Object.assign({},q);
  if(req.method==='POST'&&req.body){Object.assign(params,typeof req.body==='string'?Object.fromEntries(new URLSearchParams(req.body)):req.body);}
  params.api_key=KEY;
  try{
    const r=await fetch(BASE+EP[action],{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params).toString()});
    const d=await r.json();
    return res.status(200).json(d);
  }catch(e){return res.status(500).json({status:false,message:e.message});}
};
