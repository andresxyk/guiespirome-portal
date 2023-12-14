jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "extract-date-pre": function (a) {
    var x;
    if ($.trim(a) !== '') {
      var frDatea = $.trim(a).split(' ');
      var frTimea = (undefined != frDatea[1]) ? frDatea[1].split(':') : ["00", "00", "00"];
      var frDatea2 = frDatea[0].split('/');
      x = (frDatea2[2] + frDatea2[1] + frDatea2[0] + frTimea[0] + frTimea[1] + ((undefined != frTimea[2]) ? frTimea[2] : 0)) * 1;
    }
    else {
      x = Infinity;
    }
    return x;
  },
  "extract-date-asc": function (a, b) {
    return a - b;
  },
  "extract-date-desc": function (a, b) {
    return b - a;
  }
});

$.fn.DataTable.ext.pager.numbers_length = 4;
