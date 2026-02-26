$(function(){
 
const defaultList = ["Chleb","Mleko","Masło","Jajka"];
 
// Tworzenie elementu z checkboxem
function createItem(text, done=false){
  let li=$(`
    <li class="list-group-item list-group-item-custom">
      <div class="d-flex align-items-center gap-2">
        <input type="checkbox">
        <span>${text}</span>
      </div>
    </li>
  `);
  if(done){
    li.find("input").prop("checked",true);
    li.addClass("completed");
  }
  return li;
}
 
// Zapis do LocalStorage
function saveToLocal(){
  let items=[];
  $("#shoppingList li").each(function(){
    items.push({
      text: $(this).find("span").text(),
      done: $(this).find("input").prop("checked")
    });
  });
  localStorage.setItem("shoppingList", JSON.stringify(items));
}
 
// Wczytanie z LocalStorage
function loadFromLocal(){
  const data = localStorage.getItem("shoppingList");
  $("#shoppingList").empty();
  if(data){
    let items=JSON.parse(data);
    items.forEach(i => $("#shoppingList").append(createItem(i.text,i.done)));
  } else restoreDefaultList();
  updateStats();
}
 
// Przywrócenie domyślnej listy
function restoreDefaultList(){
  $("#shoppingList").empty();
  defaultList.forEach(item => $("#shoppingList").append(createItem(item,false)));
  saveToLocal();
  updateStats();
}
 
// Aktualizacja statystyk
function updateStats(){
  let total=$("#shoppingList li").length;
  let done=$("#shoppingList input:checked").length;
  $("#totalCount").text(total);
  $("#doneCount").text(done);
  $("#todoCount").text(total-done);
}
 
// Dodawanie elementu
function addItem(position="end"){
  let value=$("#productInput").val().trim();
  if(!value) return;
  let item=createItem(value).hide().slideDown(300);
  if(position==="start") $("#shoppingList").prepend(item);
  else $("#shoppingList").append(item);
  $("#productInput").val("");
  updateStats();
  saveToLocal();
}
 
// Obsługa przycisków
$("#addBtn").click(()=>addItem("end"));
$("#addStartBtn").click(()=>addItem("start"));
$("#addEndBtn").click(()=>addItem("end"));
$("#removeLastBtn").click(()=>{ $("#shoppingList li:last").remove(); updateStats(); saveToLocal(); });
$("#removeDoneBtn").click(()=>{ $("#shoppingList input:checked").closest("li").remove(); updateStats(); saveToLocal(); });
$("#clearBtn").click(()=>{ $("#shoppingList").empty(); updateStats(); saveToLocal(); });
$("#restoreBtn").click(()=>restoreDefaultList());
$("#sortBtn").click(()=>{
  let items=$("#shoppingList li").get();
  items.sort((a,b)=>$(a).find("span").text().localeCompare($(b).find("span").text()));
  $("#shoppingList").empty().append(items);
  saveToLocal();
});
 
// Filtr
$("#filterInput").on("keyup",function(){
  let value=$(this).val().toLowerCase();
  $("#shoppingList li").filter(function(){
    $(this).toggle($(this).find("span").text().toLowerCase().indexOf(value)>-1);
  });
});
$(".filter-btn").click(function(){
  let type=$(this).data("filter");
  $("#shoppingList li").show();
  if(type==="done") $("#shoppingList li").has("input:not(:checked)").hide();
  if(type==="todo") $("#shoppingList li").has("input:checked").hide();
});
 
// Checkbox zmiana
$("#shoppingList").on("change","input[type='checkbox']",function(){
  $(this).closest("li").toggleClass("completed");
  updateStats();
  saveToLocal();
});
 
// Edycja elementu z fade
$("#shoppingList").on("click","span",function(){
  let span=$(this);
  let text=span.text();
  let input=$("<input type='text' class='form-control form-control-sm'>").val(text);
  span.fadeOut(200,function(){
    span.replaceWith(input);
    input.focus();
  });
  input.keypress(function(e){
    if(e.which===13){
      let newText=$(this).val();
      let newSpan=$("<span>").text(newText);
      input.fadeOut(200,function(){
        input.replaceWith(newSpan);
        saveToLocal();
      });
    }
  });
});
 
// Drag & drop pionowo
$("#shoppingList").sortable({
  axis:"y",
  placeholder:"ui-sortable-placeholder",
  forcePlaceholderSize:true,
  update:function(){ saveToLocal(); }
});
 
// Ładowanie po starcie
loadFromLocal();
 
});