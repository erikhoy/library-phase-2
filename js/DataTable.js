function DataTable()
{
  Library.call(this);
  this.$container = $('#data-table');
};

DataTable.prototype = Object.create(Library.prototype);

DataTable.prototype.init = function()
{
  this._bindEvents();
  this._bindCustomListeners();
  this._updateStorage(); //all logic branches of _updateStorage call _updateTable, so this._updateTable is no longer necessary
};

DataTable.prototype._bindEvents = function ()
{
  //TODO: add native events here for search and any others needed
};

DataTable.prototype._bindCustomListeners = function ()
{

  // $('#search-form').on('submit', $.proxy(this._handleSearch, this, 'objUpdate', this.search()));
  $('#search-form').on('submit',$.proxy(this._handleSearch,this));
  $(document).on('objUpdate', $.proxy(this._updateTable, this));
  //This is a global object that can be accessed as window.bookShelf. This will hold the state of your bookShelf.
};



DataTable.prototype._handleSearch = function (e)
{
  e.preventDefault();
  var serArr = $('#search-form').serializeArray();
  var myObj = {};
  $.each(serArr,function(index, entry){
    if(entry.value){
      myObj[entry.name] = entry.value;
    }
  });
  var searchResults = this.search(myObj);
  this.handleEventTrigger('objUpdate', searchResults);

  return false;
};

DataTable.prototype._updateTable = function (e) {

  this._makeTable(e.detail);
};

DataTable.prototype._makeTable = function (books)
{
  var _self = this;
  var $tbody = this.$container.find('tbody');
  $tbody.empty();
  $('#books-table-head').html(this._createHead(new Book({})));
  $.each(books, function(index, book){
    $tbody.append(_self._createRow(book));
  });
};

DataTable.prototype._createHead = function (book)
{
  var tr = $('<tr>');
  for (var key in book) {
    var th = $('<th>').text(spacesToCamelCase(key));
    tr.append(th)
  }
  var dTH = $('<th>').text('Delete Book');
  tr.append(dTH);
  return tr;
};

DataTable.prototype._createRow = function (book)
{
  var tr = $('<tr>');
  //This created our delete column
  var deleteInput = $('<input>').attr('type', 'checkbox');
  for(var key in book){
    var td = $('<td>');
    if (key === 'cover') {
      var img = $('<img>').addClass('tableImg').attr('src', book[key]);
      $(td).html(img);
    } else if(key === 'rating'){
      $(td).html(this._stars(book[key]));
    } else {
      $(td).html(key === 'synopsis' ? book[key].substring(0,85) + "..." : book[key]);
    }
    tr.append(td);
  }
  var deleteTd = $('<td>');
  $(deleteTd).append(deleteInput);
  tr.append(deleteTd);
  return tr;
};

DataTable.prototype._stars = function (rating)
{
  var $div = $('<div>');
  for(var i=0; i<5; i++) {
    var $star = $('<span>').addClass('fa fa-star');
    if(i<rating){ $star.addClass('checked'); }
    $div.append($star);
  }
  return $div;
};

DataTable.prototype._updateStorage = function ()
{
  if (window.localStorage.length > 0) {
    console.log('BOOKSHELF EXISTS SETTING VALUE');
    window.bookShelf = this.getStorage();
    this.handleEventTrigger('objUpdate',window.bookShelf);
  } else {
    console.log('BOOKSHELF DOES NOT EXIST ADDING BOOKS!');

    this.addBooks(bookify(bookList));
    this.handleEventTrigger('objUpdate',window.bookShelf);
    this.setStorage();
  }
};

//This is the document ready that will create a new instance of DataTable
//HINT: Each class||object will need a new instance to be initalized on document ready!
$(function()
{
  window.gDataTable = new DataTable();
  window.gDataTable.init();
});
