const ADMIN_WA = "6281220774717";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx52ODko-BZ5wf_NRosaG4rieYpQqVE3U5a0cBm14Lp8UhZd-HHSkEQitC2EB8Jyhqw/exec";

const form = document.getElementById("orderForm");


// SESSION LOGIN
window.onload = () => {

  document.getElementById("nama").value =
    localStorage.getItem("nama") || "";

  document.getElementById("wa").value =
    localStorage.getItem("wa") || "";

};

function ambilLokasi(){

  const lokasiInput =
  document.getElementById("sharelok");

  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(

      (pos)=>{

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        lokasiInput.value =
        `https://maps.google.com/?q=${lat},${lng}`;

      },

      ()=>{

        lokasiInput.value =
        "Lokasi gagal diambil";

        alert(
          "Harap aktifkan izin lokasi agar bisa order."
        );

      }

    );

  } else {

    lokasiInput.value =
    "Geolocation tidak didukung";

  }

}


// FORMAT NOMOR
document.getElementById("wa")
.addEventListener("input", function(){

  let value = this.value.replace(/\D/g,'');

  if(value.startsWith("08")){
    value = "628" + value.substring(2);
  }

  if(!value.startsWith("628")){
    value = "628" + value.replace(/^0+/,'');
  }

  this.value = value;

});


// SHARELOK
window.onload = () => {

  document.getElementById("nama").value =
    localStorage.getItem("nama") || "";

  document.getElementById("wa").value =
    localStorage.getItem("wa") || "";

  // AUTO SHARELOK
  ambilLokasi();

};


// SUBMIT
form.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const lokasi =
document.getElementById("sharelok").value;

if(
  lokasi === "" ||
  lokasi.includes("gagal") ||
  lokasi.includes("didukung")
){
  alert("Lokasi wajib diaktifkan");
  return;
}

  const btn = document.querySelector(".submit-btn");

  btn.innerHTML = "Mengirim...";
  btn.disabled = true;

  const data = {

    nama:
    document.getElementById("nama").value,

    wa:
    document.getElementById("wa").value,

    alamat:
    document.getElementById("alamat").value,

    sharelok:
    document.getElementById("sharelok").value,

    pesanan:
    document.getElementById("pesanan").value,

    pembayaran:
    document.getElementById("pembayaran").value

  };

  // SESSION
  localStorage.setItem("nama", data.nama);
  localStorage.setItem("wa", data.wa);

  // SAVE SHEET
  await fetch(SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify(data)
  });

  // WHATSAPP
  const text = `*ORDER BARU*

Nama : ${data.nama}
WA : ${data.wa}

Alamat :
${data.alamat}

Sharelok :
${data.sharelok}

Pesanan :
${data.pesanan}

Pembayaran :
${data.pembayaran}`;

  const url =
  `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");

  btn.innerHTML = "KIRIM PESANAN";
  btn.disabled = false;

});



// =======================
// PWA INSTALL
// =======================

let deferredPrompt;

const installBtn =
document.getElementById("installBtn");

installBtn.style.display = "none";

window.addEventListener(
  "beforeinstallprompt",
  (e)=>{

    e.preventDefault();

    deferredPrompt = e;

    installBtn.style.display = "block";

});

installBtn.addEventListener("click", async ()=>{

  if(deferredPrompt){

    deferredPrompt.prompt();

    const result =
    await deferredPrompt.userChoice;

    if(result.outcome === "accepted"){
      installBtn.style.display = "none";
    }

  }

});



// SERVICE WORKER
if("serviceWorker" in navigator){

  window.addEventListener("load", ()=>{

    navigator.serviceWorker.register("sw.js");

  });

}
