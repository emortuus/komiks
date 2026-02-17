$(function(){

  // lista startowa
  const przykladowe = [
    "Batman – 59.99",
    "Spider-Man – 49.50",
    "One Piece Vol.1 – 39.99",
    "Naruto Vol.1 – 34.90",
    "Watchmen – 74.00",
    "Transformers: War Within – 42.00"
  ];

  const $lista = $("#lista");
  const $suma = $("#suma");

  // wypełnienie listy startowej
  function przywrocListe(){
    $lista.empty();
    przykladowe.forEach(item => dodajElement(item));
    aktualizujSume();
  }

  przywrocListe();

  // aktualizacja sumy
  function aktualizujSume(){
    let suma = 0;
    $lista.find("li").each(function(){
      const cena = parseFloat($(this).data("cena"));
      if(!isNaN(cena)) suma += cena;
    });
    $suma.text(`Suma: ${suma.toFixed(2)} zł`);
  }

  // dodanie elementu z przyciskiem "Edytuj"
  function dodajElement(text){
    const match = text ? text.match(/(.*) – (\d+(\.\d+)?)/) : null;
    const nazwa = match ? match[1].trim() : "";
    const cena = match ? parseFloat(match[2]) : 0;

    const $li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="tekst">${nazwa} – ${cena.toFixed(2)}</span>
        <button class="btn btn-sm btn-outline-secondary edytuj">Edytuj</button>
      </li>
    `).data("cena", cena);

    $lista.append($li);
  }

  // dodawanie nowego produktu
  function dodaj(naPoczatek=false){
    const nazwa = $("#nowyProdukt").val().trim();
    const cena = parseFloat($("#nowaCena").val());
    if(!nazwa || isNaN(cena)) return;

    const text = `${nazwa} – ${cena.toFixed(2)}`;
    const $li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="tekst">${text}</span>
        <button class="btn btn-sm btn-outline-secondary edytuj">Edytuj</button>
      </li>
    `).data("cena", cena);

    if(naPoczatek) $lista.prepend($li);
    else $lista.append($li);

    $("#nowyProdukt, #nowaCena").val("");
    aktualizujSume();
  }

  // przyciski
  $("#dodaj, #koniec").click(()=>dodaj(false));
  $("#poczatek").click(()=>dodaj(true));
  $("#usun").click(()=>{$lista.find("li:last").remove(); aktualizujSume();});
  $("#czysc").click(()=>{$lista.empty(); aktualizujSume();});
  $("#przywroc").click(przywrocListe);

  $("#kolory").click(()=>{
    $lista.find("li").css("background","");
    $lista.find("li:even").css("background","#d3d3d3");
  });

  $("#sortuj").click(()=>{
    const items = $lista.find("li").get().sort((a,b)=>$(a).find(".tekst").text().localeCompare($(b).find(".tekst").text()));
    $lista.empty().append(items);
  });

  // filtrowanie
  $("#filtr").on("keyup", function(){
    const v = $(this).val().toLowerCase();
    $lista.find("li").each(function(){
      $(this).toggle($(this).find(".tekst").text().toLowerCase().includes(v));
    });
  });

  // edycja po kliknięciu przycisku "Edytuj"
  $(document).on("click", ".edytuj", function(){
    const $li = $(this).closest("li");
    const $span = $li.find(".tekst");

    // jeśli już w trybie edycji – zatwierdzenie
    if($li.find("input").length){
      const nowaNazwa = $li.find("input.nazwa").val().trim();
      const nowaCena = parseFloat($li.find("input.cena").val());
      if(!nowaNazwa || isNaN(nowaCena)){
        alert("Niepoprawna nazwa lub cena!");
        return;
      }
      $li.fadeOut(150, function(){
        $span.text(`${nowaNazwa} – ${nowaCena.toFixed(2)}`);
        $li.data("cena", nowaCena);
        $li.fadeIn(150);
        aktualizujSume();
      });
      return;
    }

    // włączenie trybu edycji
    const txt = $span.text();
    const match = txt.match(/(.*) – (\d+(\.\d+)?)/);
    const nazwa = match ? match[1].trim() : "";
    const cena = match ? match[2] : "";

    $li.fadeOut(150, function(){
      $span.html(`
        <input class="form-control mb-1 nazwa" value="${nazwa}" style="width:60%; display:inline-block;">
        <input class="form-control mb-1 cena" value="${cena}" style="width:30%; display:inline-block; margin-left:5px;">
      `);
      $li.fadeIn(150);
      $li.find("input.nazwa").focus();
    });
  });

  // zapis edycji po Enter w inputach
  $(document).on("keypress", "#lista input", function(e){
    if(e.which === 13){
      $(this).closest("li").find(".edytuj").click();
    }
  });

  // podświetlenie klikniętego elementu
  $(document).on("click", "#lista li", function(){
    $("#lista li").removeClass("active");
    $(this).addClass("active");
  });

  // Gotowe do zapłaty
  $("#platnosc").click(()=>{
    let suma = 0;
    $lista.find("li").each(function(){
      const cena = parseFloat($(this).data("cena"));
      if(!isNaN(cena)) suma += cena;
    });
    alert(`Do zapłaty: ${suma.toFixed(2)} zł`);
  });

  // Drag & Drop
  $lista.sortable({
    placeholder: "ui-state-highlight"
  });
  $lista.disableSelection();

});

