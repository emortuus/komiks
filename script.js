$(document).ready(function () {
    var evenColorActive = false;
    var defaultList = ["Chleb", "Mleko", "Masło", "Jajka", "Banany", "Arbuz"];

    // tworzenie elementu listy
    function createItem(text, done) {
        var li = $("<li></li>");
        li.addClass("list-group-item d-flex align-items-center gap-2");
        var checkbox = $("<input type='checkbox'>");
        var span = $("<span></span>").addClass("flex-grow-1").text(text);
        if (done === true) {
            checkbox.prop("checked", true);
            li.addClass("completed");
        }
        li.append(checkbox).append(span);
        return li;
    }

    // zapis do localStorage
    function saveToLocalStorage() {
        var items = [];
        $("#shoppingList li").each(function () {
            var spanText = $(this).find("span").text();
            items.push({
                text: spanText,
                done: $(this).find("input[type='checkbox']").prop("checked")
            });
        });
        localStorage.setItem("shoppingList", JSON.stringify(items));
    }

    // wczytywanie z localStorage
    function loadFromLocalStorage() {
        var data = localStorage.getItem("shoppingList");
        $("#shoppingList").empty();
        if (data) {
            var items = JSON.parse(data);
            for (var i = 0; i < items.length; i++) {
                $("#shoppingList").append(createItem(items[i].text, items[i].done));
            }
        } else {
            restoreDefaultList();
        }
        updateStatistics();
    }

    // przywracanie domyślnej listy
    function restoreDefaultList() {
        var html = "";
        for (var i = 0; i < defaultList.length; i++) {
            html += "<li class='list-group-item d-flex align-items-center gap-2'>" +
                    "<input type='checkbox'>" +
                    "<span class='flex-grow-1'>" + defaultList[i] + "</span>" +
                    "</li>";
        }
        $("#shoppingList").html(html);
        saveToLocalStorage();
        updateStatistics();
    }

    // aktualizacja statystyk
    function updateStatistics() {
        var total = $("#shoppingList li").length;
        var done = $("#shoppingList li input[type='checkbox']:checked").length;
        $("#totalCount").text(total);
        $("#doneCount").text(done);
        $("#todoCount").text(total - done);
    }

    // dodawanie elementu
    function addItem(position) {
        var value = $("#productInput").val().trim();
        if (value === "") return;
        var element = createItem(value, false);
        if (position === "start") $("#shoppingList").prepend(element);
        else $("#shoppingList").append(element);
        $("#productInput").val("");
        updateStatistics();
        saveToLocalStorage();
    }

    // przyciski dodawania
    $("#addBtn").click(function () { addItem("end"); });
    $("#addStartBtn").click(function () { addItem("start"); });
    $("#addEndBtn").click(function () { addItem("end"); });

    // usuwanie
    $("#removeLastBtn").click(function () {
        $("#shoppingList li:last").remove();
        updateStatistics();
        saveToLocalStorage();
    });
    $("#removeDoneBtn").click(function () {
        $("#shoppingList input:checked").closest("li").remove();
        updateStatistics();
        saveToLocalStorage();
    });
    $("#clearBtn").click(function () {
        $("#shoppingList").empty();
        updateStatistics();
        saveToLocalStorage();
    });
    $("#restoreBtn").click(function () { restoreDefaultList(); });

    // sortowanie
    $("#sortBtn").click(function () {
        var items = $("#shoppingList li").get();
        items.sort(function (a, b) {
            return $(a).find("span").text().localeCompare($(b).find("span").text());
        });
        $("#shoppingList").append(items);
        saveToLocalStorage();
    });

    // kolorowanie co drugi
    $("#colorEvenBtn").click(function () {
        if (!evenColorActive) {
            $("#shoppingList li:visible:even").css("background-color", "#dcd6f7");
            evenColorActive = true;
        } else {
            $("#shoppingList li").css("background-color", "");
            evenColorActive = false;
        }
    });

    // obsługa checkboxa i klasy active
    $("#shoppingList").on("change", "input[type='checkbox']", function () {
        $(this).closest("li").toggleClass("completed");
        updateStatistics();
        saveToLocalStorage();
    });
    $("#shoppingList").on("click", "li", function (e) {
        if ($(e.target).is("input")) return;
        $(this).toggleClass("active");
    });

    // edycja (fadeOut -> zmiana -> fadeIn)
    $("#shoppingList").on("click", "span", function () {
        var span = $(this);
        var text = span.text();
        var input = $("<input type='text' class='form-control mb-0'>");
        input.val(text);
        span.fadeOut(200, function () {
            span.replaceWith(input);
            input.focus();
        });
        input.keypress(function (event) {
            if (event.which === 13) {
                var newText = input.val();
                var newSpan = $("<span class='flex-grow-1'></span>").text(newText);
                input.fadeOut(200, function () {
                    input.replaceWith(newSpan);
                    newSpan.hide().fadeIn(200);
                    saveToLocalStorage();
                });
            }
        });
    });

    // przesuwanie (z błękitnym podświetleniem i obsługą dotyku)
    $("#shoppingList").sortable({
        axis: "y",
        placeholder: "ui-placeholder-custom",
        delay: 150, // Konieczne dla telefonów, by odróżnić klik od przeciągania
        start: function(e, ui) {
            ui.placeholder.height(ui.item.outerHeight());
        },
        update: function () { saveToLocalStorage(); }
    });

    // POPRAWIONE FILTROWANIE
    $("#filterInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#shoppingList li").each(function () {
            var text = $(this).find("span").text().toLowerCase();
            if (text.indexOf(value) > -1) {
                $(this).attr('style', 'display: flex !important');
            } else {
                $(this).attr('style', 'display: none !important');
            }
        });
    });

    loadFromLocalStorage();
});