<script>
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

let supabase = null;

try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.log("Supabase init failed");
}

async function track(event){
  try {
    if (!supabase) return;
    await supabase.from('events').insert([{ event, time: new Date() }]);
  } catch (e) {
    console.log("Track error");
  }
}

// EMAIL POPUP
function showPopup(){
  if(localStorage.getItem("emailCaptured")) return;

  setTimeout(()=>{
    const el = document.getElementById("emailPopup");
    if(el) el.style.display = "block";
  }, 4000);
}

function closePopup(){
  document.getElementById("emailPopup").style.display="none";
}

async function submitEmail(){
  const email = document.getElementById("emailInput").value;

  if(!email || !email.includes("@")){
    alert("Enter a valid email");
    return;
  }

  localStorage.setItem("emailCaptured","true");

  await track("email_capture");

  try {
    if (supabase) {
      await supabase.from('leads').insert([{ email }]);
    }
  } catch(e){}

  document.querySelectorAll(".main-cta").forEach(btn=>{
    btn.innerText = "🔥 Get Drone – $899";
  });

  alert("✅ Discount unlocked!");
  closePopup();
}

window.onload = () => {
  if(localStorage.getItem("emailCaptured")){
    document.querySelectorAll(".main-cta").forEach(btn=>{
      btn.innerText = "🔥 Get Drone – $899";
    });
  }
  showPopup();
};
</script>