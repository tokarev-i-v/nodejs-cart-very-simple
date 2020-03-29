$("select").click(function (e) {
    let val = Array.from(e.target.options)
    .filter(option => option.selected)
    .map(option => option.value);

    console.log(val);
});
$("a").click(function (e) {
    let sel = $(e.target).parent().find('select')[0];
    let cur = Array.from(sel.options)
    .filter(option => option.selected)
    .map(option => option.value);
    let count = $(e.target).parent().find('input')[0].value;
    let id = $(e.target).attr('data-id');
    e.target.href = `/add/${id}/${cur}/${count}`;
});
