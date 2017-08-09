
var db ={};
var idBuscado = 0;


function lol() {
    console.log('booooossss');
}

function InitDom() {
    InitDb();
    //InitTable
    InitTable();
    //Capturar evento de pulsar una fila de la tabla //Leer esa fila
    BindClickRow();
    //Capturar evento de crear
    BindCreate();
    //Capturar evento de cambio en el filtro de zona
    //Capturar evento de cambio en el filtro de frecuencia
    BindFilter();
    //Capturar evento de guardar
    BindSave();
    //Capturar evento de eliminar
    BindDelete();

}


function RefreshDom() {
    //InitTable
    InitTable();
    //Capturar evento de pulsar una fila de la tabla //Leer esa fila
    BindClickRow();
    //Capturar evento de crear
    BindCreate();
    //Capturar evento de cambio en el filtro de zona
    //Capturar evento de cambio en el filtro de frecuencia
    BindFilter();
    //Capturar evento de guardar
    BindSave();
    //Capturar evento de eliminar
    BindDelete();

}

function RefreshFilterDom(zona,frecuencia) {
    //InitTable
    FilterTable(zona,frecuencia);
    //Capturar evento de pulsar una fila de la tabla //Leer esa fila
    BindClickRow();
    //Capturar evento de crear
    BindCreate();
    //Capturar evento de cambio en el filtro de zona
    //Capturar evento de cambio en el filtro de frecuencia
    BindFilter();
    //Capturar evento de guardar
    BindSave();
    //Capturar evento de eliminar
    BindDelete();

}

function InitDb() {
  db = low('data/db.json');
  db.defaults({ centros: [], index: {} })
  .write();
}

function BindFilter() {
  $( "#filtroZona" ).change(function() {
    var zona = $('#filtroZona').val();
    var frecuencia = $('#filtroFrecuencia').val();


    console.log('[ZONA]',zona);

    RefreshFilterDom(zona,frecuencia);
  });

  $( "#filtroFrecuencia" ).change(function() {
    var zona = $('#filtroZona').val();
    var frecuencia = $('#filtroFrecuencia').val();


    console.log('[ZONA]',zona);

    RefreshFilterDom(zona,frecuencia);
  });
}

function BindDelete() {
  $( "#deleteCentro" ).unbind('click').click(function() {

    db.get('centros')
      .remove({ id: idBuscado })
      .write()

    console.log('CENTRO A CREAR', centro);

    $('#tablaCentros').find('tbody').empty();

    RefreshDom();

  });
}

function BindSave() {
  $( "#saveCentro" ).unbind('click').click(function() {

    var centro = $('#EditarCentro').find('#centro').val();
    var zona = $('#EditarCentro').find('#Zona').val();
    var frecuencia = $('#EditarCentro').find('#Frecuencia').val();
    var horario = $('#EditarCentro').find('#Horario').val();
    var notas = $('#EditarCentro').find('#Notas').val();

    db.get('centros')
      .find({ id: idBuscado })
      .assign({ centro: centro,
                zona : zona,
                frecuencia : frecuencia,
                Horario : horario,
                Nota : notas})
      .write()

    console.log('CENTRO A CREAR', centro);

    $('#tablaCentros').find('tbody').empty();

    RefreshDom();

  });
}

function BindCreate() {
  $( "#CreateCentro" ).unbind('click').click(function() {

    var centro = $('#CrearCentro').find('#centro').val();
    var zona = $('#CrearCentro').find('#Zona').val();
    var frecuencia = $('#CrearCentro').find('#Frecuencia').val();
    var horario = $('#CrearCentro').find('#Horario').val();
    var notas = $('#CrearCentro').find('#Notas').val();

    var lastIndex = db.get('index')
    .value();

    if (isNaN(lastIndex)){
      lastIndex = 0;
    }

    var id = ++lastIndex;

    db.get('centros')
      .push({ id: id, centro: centro, zona: zona, frecuencia: frecuencia,
         Horario: horario, Nota: notas })
      .write();

      db.set('index', id)
        .write();



    console.log('CENTRO A CREAR', centro);

    $('#tablaCentros').find('tbody').empty();

    RefreshDom();

  });
}


function BindClickRow() {
  $( "#tablaCentros" ).find('tr').click(function() {

    console.log('eyyysss');

    idBuscado = parseInt($(this).find('th').text());

    var centroEdit = db.get('centros')
    .find({id : idBuscado})
      .value();

    console.log('[CENTRO A EDITAR]',centroEdit);

    var centro = centroEdit.centro;
    var zona = centroEdit.zona;
    var frecuencia = centroEdit.frecuencia;
    var horario = centroEdit.Horario;
    var notas = centroEdit.Nota;

    $('#EditarCentro').find('#centro').val(centro);
    $('#EditarCentro').find('#Zona').val(zona);
    $('#EditarCentro').find('#Frecuencia').val(frecuencia);
    $('#EditarCentro').find('#Horario').val(horario);
    $('#EditarCentro').find('#Notas').val(notas);


    $('#EditarCentro').modal('show');

  });
}

function FilterTable(zona,frecuencia) {
  //INIT TABLE FINAL
  //Rellenar la tabla con los indices buscados
    var centros = [];

    if (zona.length !== 0 &&
        frecuencia.length === 0){
          centros = db.get('centros')
          .filter({zona: zona})
          .value();
    }
    else if (zona.length === 0 &&
        frecuencia.length !== 0){
          centros = db.get('centros')
          .filter({frecuencia: frecuencia})
          .value();
    }
    else if (zona.length !== 0 &&
        frecuencia.length !== 0){
      centros = db.get('centros')
      .filter({zona: zona,frecuencia: frecuencia})
      .value();
    }
    else {
      centros = db.get('centros')
      .value();
    }

    console.log('[CENTROS]', centros);
    $('#tablaCentros').find('tbody').empty();


    $(centros).each(function( index ) {
      console.log( index + ": " + $(this)[0].id );
      var src = '<tr>';

      src += '<th scope="row">'+$(this)[0].id+'</th>';
      src += '<td>'+$(this)[0].centro+'</td>';
      src += '<td>'+$(this)[0].zona+'</td>';
      src += '<td>'+$(this)[0].frecuencia+'</td>';
      src += '<td>'+$(this)[0].Horario+'</td>';
      src += '<td>'+$(this)[0].Nota+'</td>';
      src += '</tr>';



      $('#tablaCentros').find('tbody').append(src);

    });

    if (centros.length === 0){
      $('#tablaCentros').find('tbody').empty();
      $('#tablaCentros').find('tbody').append('no existen registros');
    }
}

function InitTable() {
  //INIT TABLE FINAL
  //Rellenar la tabla con los indices buscados

    var centros = db.get('centros')
      .value();

    console.log('[CENTROS]', centros);


    $(centros).each(function( index ) {
      console.log( index + ": " + $(this)[0].id );
      var src = '<tr>';

      src += '<th scope="row">'+$(this)[0].id+'</th>';
      src += '<td>'+$(this)[0].centro+'</td>';
      src += '<td>'+$(this)[0].zona+'</td>';
      src += '<td>'+$(this)[0].frecuencia+'</td>';
      src += '<td>'+$(this)[0].Horario+'</td>';
      src += '<td>'+$(this)[0].Nota+'</td>';
      src += '</tr>';

      $('#tablaCentros').find('tbody').append(src);

    });
}
