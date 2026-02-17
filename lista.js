$(function() {

  const przykladowe = [
    "Batman – 59.99",
    "Spider-Man – 49.50",
    "One Piece Vol.1 – 39.99",
    "Naruto Vol.1 – 34.90",
    "Watchmen – 74.00",
    "Transformers: War Within – 42.00"
  ];

  const $lista = $("#lista");

  function dodajElement(txt){
    const m = txt.match(/(.*) – (\d+(\.\d+)?)/);
    const nazwa = m ? m[1] : "";
    const cena = m ? parseFloat(m[2]) : 0;

    const $li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="tekst">${nazwa} – ${cena.toFixed(2)}</span>
        <button class="btn btn-sm btn-outline-secondary edytuj">Edytuj</button>
      </li>
    `).data("cena", cena);

    $lista.append($li);
  }

  function przywrocListe(){
    $lista.empty();
    przykladowe.forEach(dodajElement);
  }

  przywrocListe();

  function dodaj(prepend=false){
    const n = $("#nowyProdukt").val().trim();
    const c = parseFloat($("#nowaCena").val());
    if(!n || isNaN(c)) return;

    const $li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="tekst">${n} – ${c.toFixed(2)}</span>
        <button class="btn btn-sm btn-outline-secondary edytuj">Edytuj</button>
      </li>
    `).data("cena", c);

    prepend ? $lista.prepend($li) : $lista.append($li);
    $("#nowyProdukt,#nowaCena").val("");
  }

  $("#dodaj").click(()=>dodaj());
  $("#poczatek").click(()=>dodaj(true));
  $("#koniec").click(()=>dodaj());
  $("#usun").click(()=> $lista.find("li:last").remove());
  $("#czysc").click(()=> $lista.empty());
  $("#przywroc").click(przywrocListe);

  // Filtrowanie
  $('#filtrBtn').on('click', function(){
    const fraza = $('#filtrTekst').val().toLowerCase();
    $('#lista li').each(function(){
      const text = $(this).find(".tekst").text().toLowerCase();
      $(this).toggle(text.includes(fraza));
    });
  });

  // Sortowanie A–Z
  $('#sortuj').on('click', function(){
    const items = $lista.children("li").get();
    items.sort((a,b)=> $(a).find(".tekst").text().localeCompare($(b).find(".tekst").text()));
    $lista.empty().append(items);
  });

  // Edytowanie pozycji
  $(document).on("click", ".edytuj", function(){
    const $li = $(this).closest("li");
    const $span = $li.find(".tekst");

    if($li.find("input").length){
      const n = $li.find(".nazwa").val();
      const c = parseFloat($li.find(".cena").val());
      if(!n || isNaN(c)) return;

      $li.fadeOut(200, function(){
        $span.text(`${n} – ${c.toFixed(2)}`);
        $li.data("cena", c).fadeIn(200);
      });
      return;
    }

    const t = $span.text().split(" – ");
    $span.html(`
      <input class="nazwa form-control mb-1" value="${t[0]}" style="width:60%">
      <input class="cena form-control mb-1" value="${t[1]}" style="width:30%">
    `);
  });

  $(document).on("keypress", "#lista input", function(e){
    if(e.which===13) $(this).closest("li").find(".edytuj").click();
  });

  $(document).on("click", "#lista li", function(){
    $("#lista li").removeClass("active");
    $(this).addClass("active");
  });

  // Kolorowanie co drugiej pozycji
  $("#kolory").click(()=>{
    $("#lista li").css("background","");
    $("#lista li:even").css("background","#4b445f");
  });

  // Sumowanie
  $("#sumuj").click(()=>{
    let s=0;
    $lista.find("li").each(function(){
      const c=parseFloat($(this).data("cena"));
      if(!isNaN(c)) s+=c;
    });
    $("#wynik").text(`Suma zakupów: ${s.toFixed(2)} zł`);
  });

  $("#kup").click(()=> alert($("#wynik").text()));

  // Sortowalność lista
  $lista.sortable({ placeholder:"ui-state-highlight" });

});
