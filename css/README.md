d3 icon essentials

icon.css - i can use this and its jQuery inspired ui-icon-???

i used a php variable for production and personal versions

$styleLoc = ($release_version == "production") ? JUri::base() . "components/com_psmod/xfiles/css/icon.css" : JUri::root() . "core/css/icon.css";
$fileLink->addStyleSheet($styleLoc);

make sure this css is available

    .d3-ui:after{
    content: "";
    height: 20px;
    width: 100%;
    display: block;
    background-repeat: no-repeat;
    background-position: center center;
    }


    .d3-btn:focus{
      outline:none;
      box-shadow: 0 0 12px #38c;
    }
	
	then just add a few things to the class and the icon should show
	
	" d3-btn d3-ui ui-icon-activity"
	
	you may have to increase the background size:
	
	background-size: 30px 30px;