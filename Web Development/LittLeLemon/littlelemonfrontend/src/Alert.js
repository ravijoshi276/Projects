
export default function Alert ({type,heading,message}){
    const Card = type==='success'?(<div class="fixed w-full bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3" role="alert">
  <p class="font-bold">{heading}</p>
  <p class="text-sm">{message}</p>
</div>):(<div class="fixed w-full bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3" role="alert">
  <p class="font-bold">{heading}</p>
  <p class="text-sm">{message}</p>
</div>) 
    return Card

};