'use strict';
// Per-snapshot cache: preserve original fruit order, exact bounds and wire format.
// No changes to authoritative game rules, update frequency or client protocol.
function fruitView(fruits){
 const packed=new Array(fruits.length);
 return (h,range)=>{
  const result=[],x=h[0],y=h[1],rx=range[0],ry=range[1];
  for(let i=0;i<fruits.length;i++){
   const b=fruits[i];
   if(Math.abs(b[0]-x)<rx&&Math.abs(b[1]-y)<ry){
    result.push(packed[i]||(packed[i]=[Math.round(b[0]),Math.round(b[1]),Math.round(b[2]*10)/10,b[3]]));
   }
  }
  return result;
 };
}
function writable(ws){return ws.readyState===1&&ws.bufferedAmount<200000;}
module.exports={fruitView,writable};
