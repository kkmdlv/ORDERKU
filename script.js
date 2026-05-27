let luarArea = false;

const ADMIN_WA = "6281220774717";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx52ODko-BZ5wf_NRosaG4rieYpQqVE3U5a0cBm14Lp8UhZd-HHSkEQitC2EB8Jyhqw/exec";

const form = document.getElementById("orderForm");


// SESSION LOGIN
window.onload = () => {

  document.getElementById("nama").value =
    localStorage.getItem("nama") || "";

  document.getElementById("wa").value =
    localStorage.getItem("wa") || "";

  document.getElementById("alamat").value =
    localStorage.getItem("alamat") || "";

  ambilLokasi();

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

        // =========================
        // AREA SUBANG KOTA
        // =========================

        // Koordinat pusat Subang Kota
        const centerLat = -6.5717;
        const centerLng = 107.7608;

        // radius area (KM)
        const radius = 10;

        const distance =
        hitungJarak(
          lat,
          lng,
          centerLat,
          centerLng
        );

        // jika diluar area
        if(distance > radius){

          luarArea = true;

          alert(
            "Anda sedang berada diluar area Subang Kota.\nSilahkan lengkapi alamat dengan lengkap."
          );

        }

      },

      ()=>{

        lokasiInput.value =
        "Lokasi gagal diambil";

        alert(
          "Harap aktifkan izin lokasi."
        );

      }

    );

  }

}

function hitungJarak(lat1, lon1, lat2, lon2){

  const R = 6371;

  const dLat =
  (lat2-lat1) * Math.PI / 180;

  const dLon =
  (lon2-lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) *
    Math.sin(dLat/2) +

    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *

    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c =
  2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1-a)
  );

  return R * c;

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
  localStorage.setItem("alamat", data.alamat);

  // SAVE SHEET
  await fetch(SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify(data)
  });

  // WHATSAPP
  const warningArea = luarArea
? "\n⚠ CUSTOMER BERADA DILUAR AREA SUBANG KOTA\n"
: "";

const text = `*ORDER BARU*${warningArea}

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
