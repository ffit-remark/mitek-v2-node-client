
let expiryTime = sessionStorage.getItem( 'expires_in' )
  , currentEnv = localStorage.getItem( 'env' );

$(document).ready( e => {


  setTimeout(monitorSession, 1000);

  /** 
   * Events for handling the settings.pug dialog
   */ 

  // Show the dialog
  $('#frmSettings').on('show.bs.modal', e => {
    const modal = $(e.currentTarget);

    const envSelect = modal.find('#env');
    const clientId  = modal.find('#acctname');
    const secret    = modal.find('#acctsecret');
    const okay      = modal.find('#settingsok');
    const creds     = getCreds( currentEnv );

    // Set Environment selector to current environment
    envSelect.val( currentEnv );
    clientId.val( creds.clientId );
    secret.val( creds.clientSecret );

    okay.prop( 'disabled', true );
  });

  // Listen for field updates
  $('#env, #acctname, #acctsecret').on( 'change', e => {
    // Toggle OK button
    let isDirty = false;
    if ( $(e.currentTarget).is( $('#env') ) ) {
      // Retrieve settings
      const creds = getCreds( $('#env').val() );
      $('#acctname').val( creds.clientId );
      $('#acctsecret').val( creds.clientSecret );
      isDirty = currentEnv == $('#env').val();
    }
    else {
      isDirty != $(e.currentTarget).val().length;
    }

    $('#settingsok').prop('disabled', isDirty );
  }); 

  // Write updates to client storage and renew token
  $('#settingsok').on( 'click', e => {

    currentEnv = $('#env').val();
    setCreds( currentEnv, $('#acctname').val(), $('#acctsecret').val() );
    sessionStorage.setItem( 'expires_in', '' );
    getNewToken();
  });

  /** ***********************************************
   * Handle the request body configuration section. *
   * Add multiple select / deselect functionality   *
   ** ***********************************************/
  $('#croppedAllCheck').click( e => {
    $('.chkReturnImg').prop('checked', e.currentTarget.checked );
  });

  // if all checkbox are selected, check the croppedAllCheck checkbox
  // and vice-versa
  $('.chkReturnImg').click( () => {
    let checkParent = $('.chkReturnImg').length == $('.chkReturnImg:checked').length;
    $('#croppedAllCheck').prop('checked', checkParent);
  });


  refreshRequestView();

  // Handlers for the Front Image file selection
  $('#display1').on( 'click', e => {
    $('#file1').click();
  });

  // Called when Base64 assigned in previewCapture()
  $('#data1').on('change', e => {
    $('#page2').removeClass('hide');
    refreshRequestView();
  });


  // Handlers for the Back Image file selection
  $('#display2').on('click', e => {
    $('#file2').click();
  });

  // Called when Base64 assigned in previewCapture()
  $('#data2, #data3').on('change', e => {
    refreshRequestView();
  });

  // Handlers for the Selfie Image file selection
  $('#display3').on('click', e => {
    $('#file3').click();
  });

  $('#clearEvidenceButton').on('click', e => {
    clearEvidence();
  });

  $('.requestElement').on('change', e => {
    refreshRequestView();
  });

  $('#authform').on('submit', e => {
    getNewToken();
  });

  $('#file1, #file2, #file3').on('change', e => {
    previewCapture( $(e.currentTarget) );
  });

  /* When user clicks the "JSON" tab, expand the view.
       Default presentation is collapsed at the root. */
  $('#response-json').click( e => {
    $('.parsed-json').jsonPresenter('expandAll');
  });

  $('#evidenceSubmit').click( e => {
    let payload = updateRequestBody();
    $('#requestJson').html(syntaxHighlight(JSON.stringify(payload)));
    console.log(payload);
    postEvidence( payload );
  });

});

const refreshRequestView = () => {
  $('#requestJson').html(syntaxHighlight(JSON.stringify(updateRequestBody())));
};

const writeHeader = xhr => {
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem( 'access_token' ) );
};

const displayResponse = result => {

  // Store json string in hidden HTML div
  document.getElementById('jsonInput').value = JSON.stringify(result);

  /* Uncomment this line to show raw JSON in debug */
  //$(".evidenceSubmitoutput").removeClass("hide");

  /****** Fill out Structured response page ******/
  $('#cmdRender').click();

  // Load the JSON presenter container
  $('#json-container').jsonPresenter({
    json: result,
  });

  $('.help').removeClass('hide');
  $('#tidenResultSection').removeClass('hide');

};

const postEvidence = payload => {

  let t0 = performance.now();
  let $pinner = $('.evidenceSubmitSpinner');

  $pinner.removeClass('hide');

  $.ajax({
    url: `/tiden/verify/${currentEnv}`,
    type: 'POST',
    data: JSON.stringify( payload ),
    dataType: 'json',
    timeout: 20000,
    processData: false,
    beforeSend: writeHeader,
    success: displayResponse,
    error: errorData => {
      console.log(errorData);
    },
    complete: (request, status) => { 
      $pinner.addClass('hide');
      toggleExecTime( performance.now() - t0 );
    }
  });

};


const toggleExecTime = milliseconds => {
  if (0 < milliseconds) {
    let s = '<i class="fa fa-clock-o fa-2x" aria-hidden="true" style="float:left"></i>' +
          '<div class="text-center">Execution took approx. ' + Math.round(milliseconds/1000) + ' seconds.</div>';
    $('#executionTime').html(s).addClass('alert alert-info form-group text-center');
  }
  else {
    $('#executionTime').html('');
    $('#executionTime').removeClass('alert alert-info form-group text-center');
  }
};

const clearEvidence = () => {

  $('#file1, #file2, #file3, #data1, #data2, #data3').val('');
  // Set image presentation to transparent pixel - generated using http://png-pixel.com/
  $('#display1, #display2, #display3').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  // Add class showing proxy images as background
  $('#display1, #display2').addClass('proxyDoc');
  $('#display3').addClass('proxySelfie');

  $('#croppedAllCheck, .chkReturnImg').removeProp('checked');

  $('#tidenResultSection, .evidenceSubmitoutput, .help, #page2').addClass('hide');

  refreshRequestView();

  toggleExecTime( 0 );
};


const setCreds = ( env, clientId, clientSecret ) => {
  console.log( `ID: ${clientId} - SECRET: ${clientSecret}` );
  localStorage.setItem( 'env', env );
  const creds = { clientId: clientId, clientSecret: clientSecret };
  localStorage.setItem( `${env}_creds`, JSON.stringify( creds ) );
};


const getCreds = env => {
  const  creds = localStorage.getItem( `${env}_creds` );
  if ( null === creds || undefined === creds )
    return {clientId:'',clientSecret:''}; 

  return JSON.parse( creds );
};


const initSession = response => {
  console.log( 'Token Reponse:' );
  console.log( response );

  let lifespan = 3600;
  let d = new Date();
  let t = d.getTime();
  let newTime = t + lifespan * 1000;

  sessionStorage.setItem( 'access_token', response.access_token );
  sessionStorage.setItem( 'expires_in', newTime );
  localStorage.setItem( 'env', currentEnv );

  setTimeout( monitorSession, 1000 );
};

const handleTokenError = errData => {
  if ( 400 === errData.status ) {
    showTokenStatus( 'No token - please check your settings.', 'ban' );
  }
  else {
    showTokenStatus( `No token - an error occured at the auth server: ${errData.statusText}.`, 'bomb' );
  }
}

const getNewToken = _ => {

  if ( null === currentEnv
  || 'undefined' === typeof currentEnv
  || 0 == currentEnv.length )
    currentEnv = 'sandbox';

  $.ajax({

    url: `./token/${currentEnv}`,
    type: 'POST',
    data: JSON.stringify( getCreds( currentEnv ) ),
    dataType: 'json',
    timeout: 20000,
    processData: false,
    beforeSend: xhr => {
      xhr.setRequestHeader('Content-type', 'application/json');
    },
    success: initSession,
    error: handleTokenError
  });

  return false;
};

const monitorSession = _ => {

  expiryTime = sessionStorage.getItem( 'expires_in' );
  currentEnv = localStorage.getItem( 'env' );

  if ( !expiryTime ) {
    showTokenStatus('No token - going to get new one...', 'rocket');
    getNewToken();
  }
  else {
    let d = new Date();
    let t = d.getTime();

    if ( expiryTime <= ( t + 30000 ) ) {
      showTokenStatus( 'Token expired - going to get new one...', 'rocket');
      getNewToken();
    }
    else {
      showTokenStatus( `Token is valid for approx ${Math.round((expiryTime - t)/60000)} minutes.`, 'clock-o');
      setTimeout( monitorSession, 60000 );
    }
  }
};

const showTokenStatus = ( msg, icon ) => {
  let s = '<i class=\'fa fa-' + icon + ' fa-2x\' aria-hidden=\'true\' style=\'float:left\'></i>' +
          `<div class=\'text-center\'>${msg}</div>`;
  $('.tokenvalidityinfo').removeClass( 'hide' );
  $('.tokenvalidityinfo').html( s );
  $('.panel-heading h2').text(`Tiden API Client [${currentEnv}]`);
};

const previewCapture = ( $fileInput ) => {

  let $imgContainer = $('#display' + $fileInput[0].name )
    , $imageField   = $('#data' + $fileInput[0].name );

  console.log($fileInput);
  let file = $fileInput[0].files[0];
  
  console.log('>>>>>>', file);

  if( $fileInput[0].id === 'file1' )
    if( 0 < $imageField[0].value.length )  {
      console.log($imageField[0].value.length);
      
      
      clearEvidence();
    }

  let reader = new FileReader();

  reader.addEventListener( 'load', () => {
    $imgContainer[0].src = reader.result;
    $imgContainer[0].classList.remove('proxyDoc');
    $imgContainer[0].classList.remove('proxySelfie');
    let strImage = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
    $imageField.val( strImage ).change();
  }, false);

  if ( file )
    reader.readAsDataURL( file );
};

const truncateBase64 = json => {
  json.evidence.forEach( item => {
    if ( item.type ) {
      switch ( item.type ) {
        case 'IdDocument':
          
          if ( item.images && item.images.length > 0 ) {
            let images = item.images.map( image => {
              if ( image.data ) {
                image.data = 0 < image.data.length ? '[base64 encoded image]' : image.data;
              }
            });
          }
          
        case 'Biometric':
          
          if ( item.data && item.data.length > 0 ) {
            item.data = 0 < item.data.length ? '[base64 encoded image]' : item.data;
          }
      }
    }
  });
 
 return json;
};

const syntaxHighlight = jsonStr => {

  json = truncateBase64( JSON.parse(jsonStr) );
  
  jsonStr = JSON.stringify(json, undefined, 5);

  jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

///Returns a JSON object containing the Dossier POST request body
const updateRequestBody = () => {

  const MT_REQUEST_STR = '{"evidence":[],"configuration":{"responseImages":[]}}';

  // Initialize the return object to an empty request JSON
  let returnObj = JSON.parse(MT_REQUEST_STR);

  let imageData = {};

  // Do we have any evidence?
  if ( $('#data1').val() && $('#data1').val().length != 0 ) {
    let evidenceItem = {};
    evidenceItem.type = 'IdDocument';
    evidenceItem.images = [];

    imageData.customerReferenceId = $('#file1').val().split(/(\\|\/)/g).pop();
    imageData.data = $('#data1').val();
    evidenceItem.images.push(imageData);

    if ( $('#data2').val().length != 0 )
    {
      imageData = {};
      imageData.customerReferenceId = $('#file2').val().split(/(\\|\/)/g).pop();
      imageData.data = $('#data2').val();
      evidenceItem.images.push(imageData);
    }
    returnObj.evidence.push(evidenceItem);
  }

  if ( $('#data3').val().length != 0 ) {
    imageData = {};
    imageData.type = 'Biometric';
    imageData.biometricType = 'Selfie';
    imageData.data = $('#data3').val();
    returnObj.evidence.push(imageData);
    returnObj.configuration.verifications = {'faceComparison': 'true'};
    returnObj.configuration.verifications.faceLiveness = 'true';
  }

  let chkReturnImg = document.querySelectorAll('.chkReturnImg');
  Array.prototype.forEach.call(chkReturnImg, (element, index) => {
    if ( element.checked )
      returnObj.configuration.responseImages.push(element.value );
  } );

  return returnObj;
};

const iterateJson = (inJson, elemToAppend, itemIndex) => {

  let tdClass = '';
  let tableId = elemToAppend + 'Table';

  $('#' + elemToAppend).append('<table id=\'' + tableId + '\' class=\'table\'></table>');

  for ( let key in inJson ) {

    tdClass = '';

    if ( typeof(inJson[key]) === 'string' || typeof(inJson[key]) === 'number') {

      if ( key == 'judgement' ){

        if (inJson[key] == 'Undetermined')
          tdClass = 'warning';
        if (inJson[key] == 'Fraudulent')
          tdClass = 'danger';
      }

      if ( key.substr(0, 7) == 'mrzLine' )
        inJson[key] = inJson[key].replace(/</g, '&lt;');

      $('#' + tableId).append('<tr><td class=\'' + tdClass + '\'><strong>' + key + '</strong></td><td class=\'' + tdClass + '\'>' + inJson[key] + '</td></tr>');
    }
    else
    if (  typeof(inJson[key]) === 'number' ) {

      $('#' + tableId).append('<tr><td class=\'' + tdClass + '\'><strong>' + key + '</strong></td><td class=\'' + tdClass + '\'>' + inJson[key] + '</td></tr>');
    }
    else
    if ( typeof(inJson[key]) === 'boolean' ) {

      $('#' + tableId).append('<tr><td class=\'' + tdClass + '\'><strong>' + key + '</strong></td><td class=\'' + tdClass + '\'>' + (inJson[key] ? 'True' : 'False') + '</td></tr>');
    }
    else
    if ( 0 < inJson[key].length ) { // This is a JSON array

      $('#' + tableId).append('<tr><td><strong>' + key + '</strong></td><td><div id=\'' + key + '\' class=\'well\'></div></td></tr>');

      let itmIdx = (isNaN(key))?itemIndex:key;
      iterateJson(inJson[key], key, itmIdx);
    }
    else { // It's an object

      if ( 0 < Object.keys(inJson[key]).length ) { // Only report non-empty objects

        let itmIdx = (isNaN(key))?itemIndex:key;

        $('#' + tableId).append('<tr><td><strong>' + key + '</strong></td><td><div id=\'' + key + itmIdx + '\' class=\'well\'></div></td></tr>');

        iterateJson(inJson[key], (key + itmIdx), itmIdx);
      }
    }

  }

};

