'use strict';
    //d3po Bootstrap Toolkit

    /****************************************************************************************
	//TODO:140 store & validate the data on change

    !!!!!!!Important

    bugFix: button when color changed in external style sheet reverts back to inactive state
     when styling buttons you must add:

    //these selectors for the background state including background-image:none !important when in these states.
    .col_primary0:hover, .col_primary0:focus, .col_primary0:active, .col_primary0.active,
    .col_primary0.disabled, .col_primary0[disabled]{background-color:#828282 !important;
    background-image:none !important;}

    .col_primary0{ border-color:#000 !important;
    background-image: linear-gradient(to bottom,#f2f2f2,#828282) !important; }

    search tags:
    //button prep
    //button reset

    //icon prep


	//different types?
	//see display()


    ****************************************************************************************/
    var masterButtons = function(mstrObj)
    {

      var key = {};

      var _private = function(){
          var obj = {};
        return function(testkey) {
            if(key === testkey) return obj;
            // If the user of the class tries to access private
            // properties, they won't have the access to the `key`
            console.error('Cannot access private properties');
            return undefined;
        };
      };

      var masterButtons = function(mstrObj)
      {
        //for bootstrap views
        ///mstrObj needs - name, home, selectClass,
        //example input - window['miko'] = new masterButtons({varName:'miko',home:'.masBtn_tab-pane0',type:'iconBox'});

        //properties
        this._ = _private(); // Creates a private object

        this._(key).prepType = mstrObj.type;
        this._(key).type = this._(key).prepType.toLowerCase() || "";//see set & get


        this._(key).prefix = mstrObj.varName || "masBtn";//get set

        this._(key).iUN = mstrObj.iUN || Math.round(Math.random() * 10000);//see this._(key).iUN get and set


        this._(key).objectName = mstrObj.varName;//objects variable name

        //name of the group class container

        //var homeStr = mstrObj.home;
        this._(key).home = mstrObj.home || "";

    		this._(key).clearHome = "true";

        this._(key).start = mstrObj.start || "";

        //important see set & get
        //home may need to be able to distinguish between a .class and #id string
        this._(key).stringType = "class";

        this._(key).iconDisplay = "visible";//see get & set

        this._(key).listNumber = 1;

        this._(key).groupLabelText = "";
        this._(key).dynamic_group_label = "false";

        //this._(key).homeContainer = document.getElementsByClassName(this._(key).home)[0];

        this._(key).labels = [""];
        this._(key).icons = [""];
    		//empty arrays are [] not "[]" as a string value i.e.(if(this._(key).labels == [])) arrays with an index are not [] anymore

    		this._(key).has_labels = "false";
        this._(key).has_icons = "false";
        this._(key).has_tag_data = "false";
        this._(key).tag_data_array = [];
        this._(key).tag_data_array_object = [];
        this._(key).tgk_str = (this._(key).type == "tasks") ? "tasks" : "tags";
        this._(key).tags_count = 0;
        this._(key).has_callout = "false";
        this._(key).callout_params = ["","","","","","","",""];
        this._(key).has_alt_callout = "false";
        this._(key).alt_callout_params = ["","","","","","","",""];
        this._(key).alt_event = "";
        this._(key).has_double = "false";
        this._(key).double_params = ["","","","","","","",""];
        this._(key).double_timer = "";
        this._(key).pass_event = "false";
        this._(key).double_status = "reset";
        this._(key).click_count = 0;
        this._(key).click_timer = "";

        //it doesn't need a go callout but it does need a cancel callout
        this._(key).has_go_callout = "false";
        this._(key).go_callout_params = ["","","","","","","",""];
        this._(key).has_can_callout = "false";
        this._(key).can_callout_params = ["","","","","","","",""];
        this._(key).stop_event_bubble = "false";
        this._(key).fixed_value = "false";

        this._(key).need_search_string = "true";
        this._(key).titles = [];
    		this._(key).placeholders = [];//handles more than 1 elements placeholder
    		this._(key).custom_class = [];
        this._(key).add_to_class = "";
    		this._(key).event_ids = [];//array of id's of html elements this object manages
    		this._(key).obj_attributes = [];//used to add attributes to input/textarea
    		//good for one element or duplicate attributes on multiple elements
    		this._(key).select_options = [];

        this._(key).tags_array = [];
        this._(key).tags_array_object = [];

    		this._(key).forbidList = [
    		" delete ","delete ",
    		" select ","select ",
    		" insert ","insert ",
    		" into ","into ",
    		" drop ","drop ",
    		" update ","update "/*,
    		"<",">",
    		"%3e","%3c"*/
    		];

    		this._(key).data_check_array = [];

    		this._(key).object_elements = {};
        this._(key).object_elements["data_store"] = {};
        this._(key).object_elements["temp_store"] = {};

        this._(key).obj_validity = "valid";

        this._(key).selectedButton = "";//see get get

        this._(key).selectedButtonObject = {};

        this._(key).selectedIcon = "bars";


        this._(key).text_tag = mstrObj.text_tag || "div";//see set

        this._(key).move_target_str = "";
        this._(key).move_target = "";
        this._(key).target_contents = "";
        this._(key).moveType = "";
        this._(key).close_btn = "true";
        this._(key).go_btn = "true";
        this._(key).can_btn = "true";//cancel btn
        this._(key).alt_page = "false";
        this._(key).alt_page_title = [];
        this._(key).alt_page_icon = [];
        this._(key).glass_ctrls_view = "toggle";
        this._(key).single_page = "false";
        this._(key).text_editor = "summernote";


        this._(key).set_clear = "false";

    		this._(key).id_type = "default";
    		this._(key).custom_id = "";
    		this._(key).fill_content = "";//for list,label_box,tag
    		this._(key).default_setting = "";//for slider & select
    		this._(key).inner_html = "";//for create_text_input,create_select
    		this._(key).custom_select = "false";
    		this._(key).custom_select_str = "custom";
        this._(key).custom_depth = "none";
    		this._(key).casing = "false";
    		this._(key).currentValue = "";
        this._(key).edit_object = {"html":"","text":""};
        var character_limit = 30;

        this._(key).position_tags_holder = "bottom";//alt: any other value
        this._(key).set_filter_first = "true";
        this._(key).d3_replace_id = "";
        this._(key).tags_str = "";
        this._(key).filter_mode = "add";
        this._(key).filter_target = "";
        this._(key).maxlength = "default";//for later review
        this._(key).input_icon = "false";
        this._(key).inBtn_btn_class = "";
        this._(key).icon_dir = "right";
        this._(key).preserve_entry = "false";//are rerun and preserve_entry redundant or is rerun a faster way to process preserve_entry?
        this._(key).rerun = "false";
        this._(key).modal = "true";


        //console.log("using master btns");


        //methods

        this._(key).getStringType = function(vKey,str)
        {
            var initialLetter = str.substr(0,1);
            var discovery = (initialLetter.indexOf("#") != -1)? "id" : "class";//this._(key).stringType
            return discovery;

        }//end getStringType

        this._(key).prepElementStringType = function(vKey,str)
        {
            //preps the element string type
            //removes '.' class or '#' id indicator
            var initialLetter = str.substr(0,1);//homeStr.substr(0,1);

            if(initialLetter.indexOf("#") == 0 || initialLetter.indexOf(".") == 0)
            {
                var newHome = str.substr(1);//homeStr.substr(1);
                var discovery = vKey.getStringType(vKey,str);//set stringType variable to id or class  //vKey.getStringType(vKey,str);

            }//end if
            else
            {
                alert("You must pass an object to the new masterButtons object using home: '.var' \n or home: '#var'  to set class or id of the target container");
                throw "You must pass an object to the new masterButtons object using home: '.var' \n or home: '#var'  to set class or id of the target container";
            }//end else

            return {"target":newHome,"type":discovery};
            //home = newHome;
        }//end prepElementStringType


        this._(key).prepStartString = function(vKey)
        {
			//i think this sets the default start selection of a button group

           //i need to make sure the start has the same case as the labels
           if(vKey.start != "" && vKey.selectedButton == ""){
                var isString = vKey._checkArray({'string':vKey.start,'array':vKey.labels});
                if(isString != -1){vKey.selectedButton = vKey.start}
                else{alert("please make sure the start property uses the same letters and casing as the labels");
                throw "please make sure the start property uses the same letters and casing as the labels";}
           }//end if
           else{if(vKey.labels[0] != undefined && vKey.selectedButton == ""){vKey.selectedButton = vKey.labels[0];}}

        }//end prepStartString

        if(typeof this.setStart != "function"){ masterButtons.prototype.setStart = function(str){this._(key).start = str;}}

        if(typeof this.setHome != "function"){ masterButtons.prototype.setHome = function(str){ this._(key).home = str;/*homeStr = str;*/ }}

        if(typeof this.getHome != "function"){ masterButtons.prototype.getHome = function(str){return this._(key).home;}}

        if(typeof this.setPrefix != "function"){ masterButtons.prototype.setPrefix = function(str){this._(key).prefix = str;}}
		//usually doesn't need a getter because it is set externally? if not its static

        if(typeof this.setType != "function"){ masterButtons.prototype.setType = function(str){this._(key).type = str;}}
        if(typeof this.getType != "function"){ masterButtons.prototype.getType = function(){return this._(key).type;}}

        if(typeof this.setIUN != "function"){ masterButtons.prototype.setIUN = function(str){/*must be a number*/ this._(key).iUN = parseInt(str);}}
        if(typeof this.getIUN != "function"){ masterButtons.prototype.getIUN = function(){return this._(key).iUN;}}

		//TODO:130 see where each of these can work in each display
    this._(key).setText = function(vKey,str)
    {
      vKey.inner_html = str;
      vKey.default_setting = str;
      vKey.fill_content = str;
      let raw_txt1 = vKey.htmlDecode(vKey,str);
      let raw_txt2 = vKey.htmlDecode(vKey,raw_txt1);
      vKey.edit_object = {"html":str,"text":raw_txt2};
      /*tag_text = str;*/
    }//works in: create_text_input,create_select

    if(typeof this.setText != "function"){ masterButtons.prototype.setText = function(str){this._(key).setText(this._(key),str);}}//works in: create_text_input,create_select

		if(typeof this.setDefault != "function"){ masterButtons.prototype.setDefault = function(str){this._(key).setText(this._(key),str);}}//works in: create_select

    if(typeof this.setFixedValue != "function"){
      masterButtons.prototype.setFixedValue = function(str)
      {
        this._(key).fixed_value = "true";
        this._(key).currentValue = str;
      }//works in: create_select
    }//end if

		if(typeof this.setContent != "function"){ masterButtons.prototype.setContent = function(str){this._(key).setText(this._(key),str);}}//works in: label_box, list & tag

		if(typeof this.clearHome != "function"){ masterButtons.prototype.clearHome = function(str){this._(key).clearHome = str}};//set other than true stops bigDaddy from clearing its innerHTML

    if(typeof this.setCallout != "function"){
      masterButtons.prototype.setCallout = function()
      {
        /*sample use
        if(this._(key).has_callout == "true")
        {
            var callout_fn = this._(key).callout_params[0];
            callout_fn(e,dummy.id,this._(key).callout_params[1],this._(key).callout_params[2],this._(key).callout_params[3],this._(key).callout_params[4],this._(key).callout_params[5]);

        }//end if
        */
        this._(key).has_callout = (arguments.length != 0) ? "true" : "false";
        for(var i = 0; i < arguments.length; i++)
        {
          //parameter [0] is the callout function name
          this._(key).callout_params[i] = arguments[i];

        }//end for

      }//end setCallout
    }//end if

    if(typeof this.stop_bubble != "function"){
      masterButtons.prototype.stop_bubble = function()
      {

        this._(key).stop_event_bubble = "true";

      }//end stop_bubble
    }//end if

    if(typeof this.setAltCallout != "function"){
      masterButtons.prototype.setAltCallout = function()
      {//takes at least 3 parameters event, callout, data
            /*sample use
          if(this._(key).has_alt_callout == "true")
          {
              var alt_callout_fn = this._(key).alt_callout_params[0];
              alt_callout_fn(e,dummy.id,this._(key).alt_callout_params[1],this._(key).alt_callout_params[2],this._(key).alt_callout_params[3],this._(key).alt_callout_params[4],this._(key).alt_callout_params[5]);

          }//end if
          */
          this._(key).has_alt_callout = (arguments.length != 0) ? "true" : "false";
          this._(key).alt_event = arguments[0];

          for(var i = 1; i < arguments.length; i++)
          {
            //this._(key).alt_callout_params[i] = arguments[i];
            this._(key).alt_callout_params[i-1] = arguments[i];

          }//end for

      }//end setAltCallout
    }//end if

    if(typeof this.addDouble != "function"){
      masterButtons.prototype.addDouble = function()
      {//this creates the ability to toggle between click & dblclick
        //takes at least 3 parameters event, callout, data
            /*sample use
          if(this._(key).has_double == "true")
          {
              var double_fn = this._(key).double_params[0];
              double_fn(dummy.id,this._(key).double_params[1],this._(key).double_params[2],this._(key).double_params[3],this._(key).double_params[4],this._(key).double_params[5]);

          }//end if
          */
          this._(key).has_double = (arguments.length != 0) ? "true" : "false";

          for(let i = 0; i < arguments.length; i++)
          {
            //this._(key).alt_callout_params[i] = arguments[i];
            this._(key).double_params[i] = arguments[i];

          }//end for

      }//end addDouble
    }//end if

    if(typeof this.passEvent != "function"){ masterButtons.prototype.passEvent = function(){this._(key).pass_event = "true";}}


    //it doesn't need a go callout but it does need a cancel callout
    if(typeof this.setGoCallout != "function"){
      masterButtons.prototype.setGoCallout = function()
      {
            /*sample use
          if(this._(key).has_go_callout == "true")
          {
              //setGoCallout
              var go_callout_fn = this._(key).go_callout_params[0];
              go_callout_fn(e,dummy.id,this._(key).go_callout_params[1],this._(key).go_callout_params[2],this._(key).go_callout_params[3],this._(key).go_callout_params[4],this._(key).go_callout_params[5]);

          }//end if
          */
          this._(key).has_go_callout = (arguments.length != 0) ? "true" : "false";
          for(var i = 0; i < arguments.length; i++)
          {
            this._(key).go_callout_params[i] = arguments[i];

          }//end for

      }//end setGoCallout
    }//end if

    if(typeof this.setCancelCallout != "function"){
      masterButtons.prototype.setCancelCallout = function()
      {
            /*sample use
          if(this._(key).has_can_callout == "true")
          {
              var can_callout_fn = this._(key).go_callout_params[0];
              can_callout_fn(e,dummy.id,this._(key).can_callout_params[1],this._(key).can_callout_params[2],this._(key).can_callout_params[3],this._(key).can_callout_params[4],this._(key).can_callout_params[5]);

          }//end if
          */
          this._(key).has_can_callout = (arguments.length != 0) ? "true" : "false";
          for(var i = 0; i < arguments.length; i++)
          {
            this._(key).can_callout_params[i] = arguments[i];

          }//end for

      }//end setCancelCallout
    }//end if

      if(typeof this.setIconDisplay != "function"){
        masterButtons.prototype.setIconDisplay = function(str)
        {
            if(str == "visible" || str == "hidden")
            {
                this._(key).iconDisplay = str;
            }else{
                alert("icon display text must be limited to either 'visible' or 'hidden' ");
                throw "icon display text must be limited to either 'visible' or 'hidden' ";
            }//end else
        }
      }//end if

        //sets the 'Label'(or label for the entire button group)
      if(typeof this.setGroupLabel != "function"){
        masterButtons.prototype.setGroupLabel = function(str,dGL)
        { //.setGroupLabel(inputGroupLabel,"dynamic");//
          this._(key).groupLabelText = str;
          this._(key).dynamic_group_label = dGL || "false";
        }//end setGroupLabel
      }//end if

      //sets labes and titles of the individual buttons
      if(typeof this.setLabels != "function"){
        masterButtons.prototype.setLabels = function(arObj)
        {
    			//console.log("label type = ",typeof(arObj))
    			//can take an array,a single str and be set to none
    			if(arObj != undefined && typeof(arObj) == "object")
          {
    				this._(key).labels = arObj;//still will be an array
    				this._(key).has_labels = (this._(key).labels[0] != "") ? "true" : "false";
          }else if(arObj != undefined && typeof(arObj) == "string" && arObj != ""){
    				this._(key).labels[0] = arObj;//labels initiate counts
    				this._(key).has_labels = (this._(key).labels[0] != "") ? "true" : "false";
    			}else{
    				this._(key).labels[0] = (arObj != undefined && arObj != "") ? arObj : "";
    				this._(key).has_labels = (this._(key).labels[0] != "") ? "true" : "false";
    			}

        }//end setLabels
      }//end if

      if(typeof this.setIcons != "function"){
        masterButtons.prototype.setIcons = function(arObj)
        {
    			//console.log("label type = ",typeof(arObj))
    			//can take an array,a single str and be set to none
    			if(arObj != undefined && typeof(arObj) == "object")
          {
    				this._(key).icons = arObj;//still will be an array
    				this._(key).has_icons = (this._(key).icons[0] != "") ? "true" : "false";
          }else if(arObj != undefined && typeof(arObj) == "string" && arObj != ""){
    				this._(key).icons[0] = arObj;//icons initiate counts
    				this._(key).has_icons = (this._(key).icons[0] != "") ? "true" : "false";
    			}else{
    				this._(key).icons[0] = (arObj != undefined && arObj != "") ? arObj : "";
    				this._(key).has_icons = (this._(key).icons[0] != "") ? "true" : "false";
    			}

        }//end seticons
      }//end if

        if(typeof this.setTitles != "function"){
          masterButtons.prototype.setTitles = function(arObj)
          {
      			if(arObj != undefined && typeof(arObj) == "object"){
      				this._(key).titles = arObj;
      			}else{
      				this._(key).titles[0] = (arObj != undefined && arObj != "") ? arObj : "";
      			}//end if

          }//end setTitles
        }//end if

        if(typeof this.setPlaceholders != "function"){
          masterButtons.prototype.setPlaceholders = function(arObj)
          {
              this._(key).placeholders = arObj;

          }//end setPlaceholders
        }//end if


        if(typeof this.setFilterMode != "function"){
          masterButtons.prototype.setFilterMode = function(sFObj)
          {
            this._(key).filter_mode = (sFObj != undefined && sFObj.mode != undefined && sFObj.mode != "") ? sFObj.mode : "add";
            this._(key).need_search_string = (sFObj != undefined && sFObj.need_search_string != undefined && sFObj.need_search_string != "") ? sFObj.need_search_string : "true";//"true" or "false" string value
            if(sFObj != undefined && sFObj._target != undefined && sFObj._target != "")
            {
              this._(key).filter_target = sFObj._target;
            }
          };
        }//end if

        if(typeof this.setSelectedButton != "function"){
          masterButtons.prototype.setSelectedButton = function(str)
          {
              this._(key).selectedButton = str;
          }//end setSelectedButton
        }//end if

        if(typeof this.setSelectedIcon != "function"){
          masterButtons.prototype.setSelectedIcon = function(str){

            var isString = this._(key)._checkArray({'string':str,'array':this._(key).iconList});

            if(isString != -1){ this._(key).selectedIcon = str;}
            else
            {
                alert("setSelectedIcon string must be the title of a JQuery Mobile icon.");
                throw "setSelectedIcon string must be the title of a JQuery Mobile icon.";
            }

          }//end setSelectedIcon
        }//end if


        if(typeof this.getIconDisplay != "function"){ masterButtons.prototype.getIconDisplay = function(){return this._(key).iconDisplay.toLowerCase();}}


        if(typeof this.getSelectedButton != "function"){
          masterButtons.prototype.getSelectedButton = function()
          {
              return this._(key).selectedButton.toLowerCase();

          }//end getSelectedButton
        }//end if

        if(typeof this.getSelectedIcon != "function"){ masterButtons.prototype.getSelectedIcon = function(){return this._(key).selectedIcon.toLowerCase();}}

        if(typeof this.setCloseBtn != "function"){ masterButtons.prototype.setCloseBtn = function(str){this._(key).close_btn = str;}}
        if(typeof this.setGoBtn != "function"){ masterButtons.prototype.setGoBtn = function(str){this._(key).go_btn = str;}}
        if(typeof this.setCancelBtn != "function"){ masterButtons.prototype.setCancelBtn = function(str){this._(key).can_btn = str;}}


        if(typeof this.setSinglePage != "function"){ masterButtons.prototype.setSinglePage = function(str){this._(key).single_page = "true";}}


        if(typeof this.setAltPage != "function"){
          masterButtons.prototype.setAltPage = function(oStr)
          {
            this._(key).alt_page = "true";

            if(oStr != undefined && oStr.title != undefined && oStr.title != "" && typeof(oStr.title) == "object"){

              this._(key).alt_page_title = oStr.title;//still will be an array

            }else {
              this._(key).alt_page_title[0] = (oStr != undefined && oStr.title != "") ? oStr.title : "";
            }

            if(oStr != undefined && oStr.icon != undefined && oStr.icon != "" && typeof(oStr.icon) == "object"){

              this._(key).alt_page_icon = oStr.icon;//still will be an array

            }else {
              this._(key).alt_page_icon[0] = (oStr != undefined && oStr.icon != "") ? oStr.icon : "";
            }//end else

          }//end setAltPage
        }//end if


        if(typeof this.view_ctrl_row != "function"){
          masterButtons.prototype.view_ctrl_row = function()
          {
            this._(key).glass_ctrls_view = "row";
          }
        }//end if


      this._(key)._checkArray = function(sObj)
        {
          //formerly checkArrayForString
          //check array for string item
          //is this string found in any of the array items?
            var testString = sObj.string;
            var testArray = sObj.array;

            var strIndx = -1;

            for(var i = 0; i < testArray.length; i++)
            {
                var checkString = testArray[i];

				//does the array index have this string anywhere in it
				//"&*()$".indexof("*")
                if(checkString.indexOf(testString) != -1)
                {
                  strIndx = i;
                }

            }//end for

            return strIndx;
        }//end _checkArray

  	this._(key)._checkString = function(sObj)
  	{
      //formerly checkStringForArray
      //check string for array items
      //are any of these array items found anywhere in this string
  		//example use: var isString = this._(key)._checkString({'string':this._(key).start,'array':labels});

  		var testString = sObj.string;
  		var testArray = sObj.array;

  		var strIndx = -1;

  		for(var i = 0; i < testArray.length; i++)
  		{
  			var checkString = testString;//

  			//does the string - (usually long) have anything found in this (short) array index
  			//"https://youtube.com/#*(&$)*&*(*)whatever".indexof("youtube")
  			if(checkString.indexOf(testArray[i]) != -1)
  			{
  			  strIndx = i;
  			}
  		}//end for

  		return strIndx;

  	}//_checkString

        if(typeof this.setListNumber != "function"){ masterButtons.prototype.setListNumber = function(str){this._(key).listNumber = parseInt(str);}}


        if(typeof this.getObjectName != "function"){ masterButtons.prototype.getObjectName = function(){return this._(key).objectName;}}

        if(typeof this.setTextTag != "function"){
          masterButtons.prototype.setTextTag = function(str)
          {//create regExp checker
              this._(key).text_tag = str;
          }//end setHtag
        }//end if

        /*sets the element you want moved / or where its coming from*/
        if(typeof this.setMoveTarget != "function"){ masterButtons.prototype.setMoveTarget = function(str){ this._(key).move_target_str = str;}}

		if(typeof this.setClear != "function"){ masterButtons.prototype.setClear = function(){this._(key).set_clear = "true";}}

    if(typeof this.setCustomClass != "function"){
      masterButtons.prototype.setCustomClass = function(clsAry,addPar)
      {
        this._(key).custom_class = clsAry;
        this._(key).add_to_class = addPar || "";/*addPar adds to the parent of the target (casing) not the target element*/
      }
    }//end if

		if(typeof this.get_event_ids != "function"){ masterButtons.prototype.get_event_ids = function(){return this._(key).event_ids;}}

		if(typeof this.setInputAttributes != "function"){ masterButtons.prototype.setInputAttributes = function(iObj){ this._(key).obj_attributes.push(iObj);}}

		if(typeof this.setCustomId != "function"){ masterButtons.prototype.setCustomId = function(cId){this._(key).custom_id = cId; this._(key).id_type = "custom";}}
		if(typeof this.setSelectOptions != "function"){ masterButtons.prototype.setSelectOptions = function(sAry){this._(key).select_options = sAry;}}

    if(typeof this.setCustomSelect != "function"){
      masterButtons.prototype.setCustomSelect = function(sCs)
  		{
  			if(this._(key).type != "slider")
  			{
          if(sCs != undefined && typeof(sCs) == "object"){
            this._(key).custom_select = "true";
            this._(key).custom_select_str = (sCs != undefined && sCs.title != undefined && sCs.title != "") ? sCs.title : "custom";
            this._(key).custom_depth = (sCs != undefined && sCs.depth != undefined && sCs.depth != "" && isNaN(sCs.depth) != true) ? sCs.depth : "none";
          }else{
            this._(key).custom_select = "true";
            this._(key).custom_select_str = (sCs != undefined && sCs != "") ? sCs : "custom";
          }//end if
  			}
  		}//end if setCustomSelect
    }//end if

    if(typeof this.runDataCheck != "function"){
    masterButtons.prototype.runDataCheck = function(){

			//data_check_object_str = JSON.stringify(data_check_object);
      var valid_value = "valid";

			for(var dc = 0; dc < this._(key).data_check_array.length; dc++)
			{
				var vv = this._(key).dataCheck(this._(key),this._(key).data_check_array[dc]);
        if(vv != "valid")
        {
          valid_value = vv;
        }

			}//end for

      return valid_value;

  		}//end runDataCheck
    }//end if

		if(typeof this.setCasing != "function"){ masterButtons.prototype.setCasing = function(){this._(key).casing = "true";}}

    //tags setters
    if(typeof this.setPosition != "function"){ masterButtons.prototype.setPosition = function(str){ this._(key).position_tags_holder = str;}}
    if(typeof this.setFirst != "function"){ masterButtons.prototype.setFirst = function(str){this._(key).set_filter_first = str;}}

    if(typeof this.setFilter != "function"){
      masterButtons.prototype.setFilter = function(str)
      {
        filter_type = str;
      }
    }//end if

    if(typeof this._replace != "function"){ masterButtons.prototype._replace = function(rId){this._(key).d3_replace_id = rId;}}

    if(typeof this.setTags != "function"){
    masterButtons.prototype.setTags = function(str)
    {
      //set up tag array - in edit mode
      this._(key).has_tag_data = "true";

      if(this._(key).type == "tags")
      {
        this._(key).tag_data_array = str.split(",");
      }else
      {
        this._(key).tag_data_array_object = JSON.parse(str);//no need for .html

        //i think i can traverse the object to create a string of my own here
        for(let i = 0; i < this._(key).tag_data_array_object.length; i++)
        {
          let task_text = this._(key).tag_data_array_object[i].text;
          this._(key).tag_data_array[i] = task_text;
        }//end for

      }//end else


      //this._(key).setText(str);
    }//end setTags
  }//end if


    if(typeof this.setMaxLength != "function"){masterButtons.prototype.setMaxLength = function(mxStr){ this._(key).maxlength = mxStr;}}//end setMaxLength;

    if(typeof this.setInputIcon != "function"){
    masterButtons.prototype.setInputIcon = function(ii,dir,cls)
    {
      if(ii != undefined && typeof(ii) == "object")
      {
        this._(key).input_icon = (ii.icon != undefined && ii.icon != "") ? ii.icon : this._(key).input_icon;
        this._(key).icon_dir = (ii.direction != undefined && ii.direction != "") ? ii.direction : this._(key).icon_dir;
        this._(key).inBtn_btn_class = (ii.class != undefined && ii.class != "") ? ii.class : this._(key).inBtn_btn_class;
      }else
      {
        this._(key).input_icon = ii;
        this._(key).icon_dir = dir || this._(key).icon_dir;
        this._(key).inBtn_btn_class = cls || this._(key).inBtn_btn_class;
      }//end else
    }//end setInputIcon
  }//end if

  if(typeof this.preserveEntry != "function"){masterButtons.prototype.preserveEntry = function(){this._(key).preserve_entry = "true";}}//end if

  if(typeof this.unsetModal != "function"){masterButtons.prototype.unsetModal = function(){this._(key).modal = "false";}}//end if
  if(typeof this.setEditor != "function"){ masterButtons.prototype.setEditor = function(str){this._(key).text_editor = str}};//set other than true stops bigDaddy from clearing its innerHTML




		this._(key).custom_input_id = "";
		this._(key).custom_select_id = "";


        this._(key).iconList = ['action','alert','arrow-d','arrow-d-l',
        'arrow-d-r','arrow-l','arrow-r','arrow-u','arrow-u-l',
        'arrow-u-r','audio','back','bars','bullets','calendar',
        'camera','carat-d','carat-l','carat-r','carat-u','check',
        'clock','cloud','comment','delete','edit','eye',
        'forbidden','forward','gear','grid','heart','home',
        'info','location','lock','mail','minus','navigation',
        'phone','plus','power','recycle','refresh','search',
        'shop','star','tag','user','video'];

    if(typeof this.iconBoxDisplay != "function"){
      masterButtons.prototype.iconBoxDisplay = function()
      {
  			/************************************** Sample Code ****************************************
  			window['miko'] = new masterButtons({varName:'miko',home:'.masBtn_tab-pane0',type:'iconBox'});
  			//miko.iconBoxDisplay();
  			//miko.setIconDisplay('hidden');//works
  			//miko.setSelectedIcon("bullets");works
  			miko.display();
  			********************************************************************************************/



            //Needed properties - home - name of the group class container

            var homeContainer = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //clear the stage
            homeContainer.innerHTML = "";

            homeContainer.style.minHeight = "100px";

            //needs text
            //icon prep
            var iBoxtext = document.createElement('h5');
            iBoxtext.innerHTML = "Select an icon";
            iBoxtext.className = this._(key).prefix + "_iBox_text";
            homeContainer.appendChild(iBoxtext);

            //masterCont - goes into the homeContainer
            var masBtnCont = document.createElement('div');
            masBtnCont.className = this._(key).prefix + "_MBCont " + this._(key).prefix + "_MBCont" + this._(key).iUN;//controls
            //masBtnCont.style = "border:1px solid yellow;height:auto;margin:auto;width:60%;";//script in css

            //masterButton Icon Menu - goes into masterCont
            var masBtnIconMenu = document.createElement('div');
            masBtnIconMenu.className = this._(key).prefix + "_icon_menu " + this._(key).prefix + "_icon_menu" + this._(key).iUN;
            //masBtnIconMenu.style = "height:100px; border:1px solid red; overflow-y:auto;width:50%;";//script in css
            //buttons go in the icon menu

            //master Button Select Container - goes into MasterCont
            var masBtnSelectCont = document.createElement('div');
            masBtnSelectCont.className = this._(key).prefix + "_Choice_cont " + this._(key).prefix + "_Choice_cont" + this._(key).iUN;
            //masBtnSelectCont.style = "border:1px solid grey;float:left;height:100px;width:30%;";

            //master Button Choice - goes into master Button Select Container
            //I need to create selected button & hide it
            newSelectBtn = document.createElement('div');
            newSelectBtn.id = this._(key).prefix + '_Choice' + this._(key).iUN;
            newSelectBtn.className = "well " + this._(key).prefix + "_Choice " + this._(key).prefix + "_Choice" + this._(key).iUN + " jqm_icon_" + this._(key).selectedIcon;
            //newSelectBtn.style = "height:25px;width:25px;float:left;";
            newSelectBtn.setAttribute('data-value',this._(key).selectedIcon);
            newSelectBtn.title = this._(key).selectedIcon + " icon";
            newSelectBtn.name = this._(key).selectedIcon;
            newSelectBtn.style.visibility = this._(key).iconDisplay;


            //show Hide display icon button
            toggleDisplayBtn = document.createElement('div');
            toggleDisplayBtn.id = this._(key).prefix + '_toggleDisplay' + this._(key).iUN;
            toggleDisplayBtn.className = (this._(key).iconDisplay == 'visible') ? "well btn-success " + this._(key).prefix + "_toggleDisplay "
            + this._(key).prefix + "_toggleDisplay" + this._(key).iUN : "well btn-danger " + this._(key).prefix + "_toggleDisplay " + this._(key).prefix + "_toggleDisplay" + this._(key).iUN  ;

            toggleDisplayBtn.title = "switch Display on and off";
            toggleDisplayBtn.setAttribute('onclick',"minorButtons({'action':'changeDisplayIcon','objectName':'" + this._(key).objectName + "','toggle':'" + this._(key).iconDisplay + "'})");
            toggleDisplayBtn.innerHTML = (this._(key).iconDisplay == 'visible') ? "ON" : "OFF";


            masBtnCont.appendChild(masBtnIconMenu);
            masBtnCont.appendChild(masBtnSelectCont);
            var clearer = document.createElement('div');
            clearer.className = "iconBox clr";
            masBtnCont.appendChild(clearer);

            masBtnSelectCont.appendChild(newSelectBtn);
            masBtnSelectCont.appendChild(toggleDisplayBtn);
            homeContainer.appendChild(masBtnCont);


            //creates menu of buttons to choose from
            for(i=0;i < this._(key).iconList.length; i++)
            {
               newBtn = document.createElement('button');
               newBtn.setAttribute("type","button");
               newBtn.className = "well jqm_btn jqm_" + this._(key).prefix + "btn jqm_icon_" + this._(key).iconList[i];
               newBtn.setAttribute("onclick","minorButtons({'action':'showCaseIcon','objectName':'" + this._(key).objectName + "'})");

               /*
               I need to see one of these to see if it works
               originally I tried puting the brackets in quotes '{'action':'pressbutton'}'
               */

               newBtn.style = "height:25px;width:25px;float:left;";//display:none
               newBtn.title =  this._(key).iconList[i] + " icon";
               newBtn.name =  this._(key).iconList[i];

               masBtnIconMenu.appendChild(newBtn);

            }//end for

        }//end iconBoxDisplay
      }//end if

        if(typeof this.showCaseIcon != "function"){
        masterButtons.prototype.showCaseIcon = function(rData)
        {
            //alert("I'm Back");
           //manages the view/style once an icon button is pressed
           var uPBN = 'jqm_' + this._(key).prefix + 'btn'; //+ this._(key).iUN

           /*if Im successfully using buttons and not divs this code is redundant
           buttons automatically activate and inactivate*/
            var btnClass = document.getElementsByClassName(uPBN);
            for(var i=0;i < btnClass.length; i++ )
            {
               //resets all the buttons to inactive
               var btnAdjust = document.getElementsByClassName(uPBN)[i];
               btnAdjust.btnStatus = "inactive";

            }

            var e = event || window.event;

            //then activates that target
            var curBtn = e.srcElement;
            curBtn.btnStatus = "active";
            //alert("icon name = " + curBtn.name);

            //it just changes the attributes of the choice sample to match the users preference
            uBtnChoice = this._(key).prefix + '_Choice' + this._(key).iUN;
            var tBtn = document.getElementById(uBtnChoice);
            tBtn.className = "well " + this._(key).prefix + "_Choice " + this._(key).prefix + "_Choice" + this._(key).iUN + " jqm_icon_" + curBtn.name;
            tBtn.title = curBtn.name + " icon";
            tBtn.name = curBtn.name;

            this._(key).selectedIcon = curBtn.name;

          /*alert("b1 status = " + b1.btnStatus + "\n b2 status = " + b2.btnStatus + "\n b3 status = " + b3.btnStatus +
           "\n \n b1 classname is " + b1.className + "\n b2 classname is " + b2.className + "\n b3 classname is " + b3.className );*/

        }// end showCaseIcon
      }//end if

        if(typeof this.changeDisplayIcon != "function"){
        masterButtons.prototype.changeDisplayIcon = function(actn)
        {

            //alert();
            var e = event || window.event;
            //then activates that target
            var current_Btn = e.srcElement;



            var idStr = this._(key).prefix + '_Choice' + this._(key).iUN;
             var tBtn = document.getElementById(idStr);
            //var tst = bVTest.options.length;

            if(actn == "visible")
            {
                tBtn.style.visibility = "hidden";
                current_Btn.setAttribute("onclick","minorButtons({'action':'changeDisplayIcon','objectName':'" + this._(key).objectName + "','toggle':'hidden'})");
                current_Btn.className = "well btn-danger " + this._(key).prefix + "_toggleDisplay " + this._(key).prefix + "_toggleDisplay" + this._(key).iUN ;
                current_Btn.innerHTML = "OFF";
                current_Btn.title = "click to turn the icon's display on.";
                this._(key).iconDisplay = "hidden";
            }else
            {
                tBtn.style.visibility = "visible";
                current_Btn.setAttribute("onclick","minorButtons({'action':'changeDisplayIcon','objectName':'" + this._(key).objectName + "','toggle':'visible'})");
                current_Btn.className = "well btn-success " + this._(key).prefix + "_toggleDisplay " + this._(key).prefix + "_toggleDisplay" + this._(key).iUN ;
                current_Btn.innerHTML = "ON";
                current_Btn.title = "click to turn the icon's display off.";

                this._(key).iconDisplay = "visible";
            }


        }//end changeDisplayIcon
      }//end if
        /*
        //dynamic prototype example
            if(typeof this.sayName != "function"){
              Person.prototype.sayName = function()
              {
               //console.log(this.name);
              };
            }
        */


    if(typeof this.groupButtonDisplay != "function"){
        masterButtons.prototype.groupButtonDisplay = function()
        {
			/****************************************** Sample Code *********************************************
			window['mIICol'] = new masterButtons({varName:'mIICol',home:'.mIList_ListArea1',type:'buttonGroup'});
            mIICol.setPrefix('mIICol');
            mIICol.setLabels(['Default','Black']);
            mIICol.setTitles(['Default colors icons white','Color icons black.']);
            mIICol.setGroupLabel('icon color?','dynamic');
			mIICol.setCustomClass(["ui-icon-notification ui-btn ui-btn-icon-notext ui-shadow ui-btn-inline","ui-icon-mail ui-btn ui-btn-icon-notext ui-shadow ui-btn-inline"],"add_btn");
			mIICol.setCasing();
            mIICol.display();

			//use the event id function
			var event_id_array = mIICol.get_event_ids();
			var targetElement = document.getElementById(event_id_array[0]);
			targetElement.onclick = function(){alert("id additions work")};
			******************************************************************************************************/

      var vKey = this._(key);

			if(this._(key).labels == undefined || this._(key).labels == [] || this._(key).labels[0] == "")
      {
                    alert("button needs a label, \n add an array of labels to \n the setLabels method. ");
					return;
			}

            //button prep
            //this one originally used an id.  but now it doesn't matter
            var homeCont = (/*stringType == "class"*/document.getElementById(this._(key).home)) ?document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];//"option1"

            //clear the stage
			if(this._(key).clearHome == "true"){
				homeCont.innerHTML = "";
      }//end if

      //i don't know if i need this
			if(this._(key).casing != "false"){

				var newObj_casing = document.createElement('div');
				newObj_casing.id = this._(key).prefix + "_TCasing" + this._(key).iUN;
				newObj_casing.className = this._(key).prefix + "_TCasing" + this._(key).iUN + " " + this._(key).prefix + "_TCasing "  + this._(key).prefix + "_TCasing TCasing " + add_custom_class;

			}//end if casing


            var groupCase = document.createElement('div');
            groupCase.className = "btn-group-case " + this._(key).prefix + "_groupCase " + this._(key).prefix + "_groupCase" + this._(key).iUN + " groupCase" + " " + this._(key).add_to_class;

                var groupContainer = document.createElement('div');
                groupContainer.className = "btn-group " + this._(key).prefix + "_groupCont " + this._(key).prefix + "_groupCont" + this._(key).iUN + " groupCont" + " " + this._(key).add_to_class;

            groupCase.appendChild(groupContainer);

            if(this._(key).groupLabelText != "")
            {
                this._(key).object_elements.labelText = document.createElement('div');
                this._(key).object_elements.labelText.innerHTML = this._(key).groupLabelText;
                this._(key).object_elements.labelText.className = this._(key).prefix + "_labelText labelText " + this._(key).prefix + "_labelText" + this._(key).iUN + " " + this._(key).add_to_class;

        				if(this._(key).casing != "false"){
        					newObj_casing.appendChild(this._(key).object_elements.labelText);
        				}else{
        					homeCont.appendChild(this._(key).object_elements.labelText);
        				}

            }

            //use labels array to determine how many buttons to set
            //if the titles array is used, use it along with the labels if not use a conditional operator for blank strings
            var lengthVariable = this._(key).labels.length || 1;

            for(var i=0; i < lengthVariable; i++)
            {
                var newBtn = document.createElement('button');
                newBtn.setAttribute("type","button");

				        var add_custom_class = (this._(key).custom_class.length > 1) ? " " + this._(key).custom_class[i] + " " :(this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

                //repeated in chooseButton for statement
                /*newBtn.className = "btn btn-primary " + this._(key).prefix + "_primary " + this._(key).prefix + "_primary" + i + " "
                + this._(key).prefix + "_primary" + this._(key).iUN + " " + this._(key).prefix + "_btn_group" + this._(key).iUN + "_" + i + " ";*/

                newBtn.className = "btn " + this._(key).prefix + "_btn_group " + this._(key).prefix + "_btn_group" + i + " "
                + this._(key).prefix + "_btn_group" + this._(key).iUN + " " + this._(key).prefix + "_btn_group" + this._(key).iUN + "_" + i + " " + add_custom_class;

                newBtn.id = this._(key).prefix + "_btn_group" + this._(key).iUN + "_" + i;
				        this._(key).event_ids.push(newBtn.id);

                //here is the only place where capital letters are needed
                newBtn.innerHTML = this._(key).labels[i] || "";
                if(this._(key).labels[i] == undefined || this._(key).labels == []  || this._(key).labels[i] == "")
                {
                    alert("button needs a label, \n add an array of labels to \n the setLabels method. ");
					          return;
                }else
                {
                    newBtn.setAttribute('data-value',this._(key).labels[i]);
                    //newBtn.setAttribute('onclick',"minorButtons({'action':'chooseButton','objectName':'" + this._(key).objectName + "'})");
					          newBtn.addEventListener('click',function(){vKey.chooseButton(vKey);});
                    newBtn.title = this._(key).titles[i] || "";

                //sets start/default selection
                if(this._(key).labels[i].toLowerCase()  == this._(key).selectedButton.toLowerCase() )
                {
      						newBtn.className += " active ";

      						this._(key).currentValue = (this._(key).fixed_value == "false") ? this._(key).selectedButton : this._(key).currentValue;

                  if(this._(key).groupLabelText != "" && this._(key).dynamic_group_label != "false")
                  {
                        this._(key).object_elements.labelText.innerHTML = this._(key).groupLabelText + " " + this._(key).currentValue;
                  }//end if groupLabelText

					      }//end if labels

            }//end if

            //helps read setup setInputAttributes json parameters
            for(var x = 0; x < this._(key).obj_attributes.length; x++)
            {
              var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
              var pName = pNameAry[0];
              newBtn.setAttribute(pName,this._(key).obj_attributes[x][pName]);
              //console.log(newObj);

            }//end for



            groupContainer.appendChild(newBtn);

    				if(this._(key).casing != "false"){

    					newObj_casing.appendChild(groupCase);
    					homeCont.appendChild(newObj_casing);
    				}else{

    					homeCont.appendChild(groupCase);
    				}

          }//end for

          //why is this clear heare on the inside of this object not on the outside
          //var clearer = document.createElement('div');
          //clearer.className = "group_btn clr";
          //homeCont.appendChild(clearer);

    			//if selectedButton is still empty
    			if(this._(key).labels[0] != undefined && this._(key).selectedButton == "")
    			{
            //im not sure it will ever have to run this. selectedButton is set in prepStartString
    				this._(key).selectedButton = this._(key).labels[0];
    				this._(key).currentValue = (this._(key).fixed_value == "false") ? this._(key).selectedButton : this._(key).currentValue;

            if(this._(key).groupLabelText != "" && this._(key).dynamic_group_label != "false")
            {
                  this._(key).object_elements.labelText.innerHTML = this._(key).groupLabelText + " " + this._(key).currentValue;
            }//end if groupLabelText

    			}//end if labels


        }//end groupButtonDisplay
      }//end if

      if(typeof this.chooseButton != "function"){masterButtons.prototype.chooseButton = function(){this._(key).chooseButton(this._(key));}}//may not need this anymore

        this._(key).chooseButton = function(vKey)
        {//var chooseButton - may need to remain a var
            var e = event || window.event;
            //then activates that target
            var current_Btn = e.srcElement;


            var groupStr = vKey.prefix + "_btn_group" + vKey.iUN;
           var buttonGroup = document.getElementsByClassName(groupStr);
           for(var i = 0; i < buttonGroup.length; i++)
           {
                var modBtn = document.getElementsByClassName(groupStr)[i];
               /*modBtn.className = "btn btn-primary " + vKey.prefix + "_primary " + vKey.prefix + "_primary" + i + " "
                + vKey.prefix + "_primary" + vKey.iUN + " " + vKey.prefix + "_btn_group" + vKey.iUN + "_" + i + " ";*/

				        var add_custom_class = (vKey.custom_class.length > 1) ? " " + vKey.custom_class[i] + " " :(vKey.custom_class.length == 1) ? " " + vKey.custom_class[0] + " " : "";

                modBtn.className = "btn " + vKey.prefix + "_btn_group " + vKey.prefix + "_btn_group" + i + " "
                + vKey.prefix + "_btn_group" + vKey.iUN + " " + vKey.prefix + "_btn_group" + vKey.iUN + "_" + i + " " + " " + add_custom_class;
            }//end for

            current_Btn.className += " active ";
            vKey.selectedButton = current_Btn.dataset.value;
            vKey.selectedButtonObject = {'btn':current_Btn.id,'value':current_Btn.dataset.value};

			      vKey.currentValue =  (vKey.fixed_value == "false") ? vKey.selectedButton : vKey.currentValue;

            if(vKey.groupLabelText != "" && vKey.dynamic_group_label != "false")
            {
                  vKey.object_elements.labelText.innerHTML = vKey.groupLabelText + " " + vKey.currentValue;
            }//end if

            if(vKey.has_callout == "true")
            {
                var callout_fn = vKey.callout_params[0];
                callout_fn(e,vKey.selectedButtonObject,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

            }//end if

        }//end chooseButton



    if(typeof this.tabContentDisplay != "function"){
      masterButtons.prototype.tabContentDisplay = function(nbr)
      {
  		/********************************* Sample Code *******************************************
  			window['mIOt'] = new masterButtons({varName:'mIOt',home:'.menu_items_modal',type:'tabs'});
              mIOt.setPrefix('mIOt');
              mIOt.setLabels(['option 1','option 2']);
              mIOt.display();

  			add 'pills' to change tabs to pills
  			//bootstrap not JQueryMobile
  		*******************************************************************************************/


              /*
              <div class="menu_options_box container">
                  <ul class="nav this._(key).typetabs"></ul>
                  <div class="tab-content"></div>
              </div>
              */

              //alert("data object is " + dataObject);
                  //mcust_option1 menu_custom_option
                  //               <ul class="nav nav-tabs mcust_List"></ul>
                                                      //<div class="mcust_tab-content"></div>

  				if(this._(key).labels == undefined || this._(key).labels == [] || this._(key).labels[0] == "")
                  {
                      newBtn.title = "tab needs a label, \n add single string or an array of labels to \n the setLabels method. ";
  					return;
                  }//end if

                  var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
                  var listEl = document.createElement('ul');
                  var listStr = this._(key).prefix + "_List";
                  listEl.className = "nav nav-" + this._(key).type + " " + this._(key).prefix + "_List " + this._(key).prefix + "_List" + this._(key).iUN;

                  var contentEl = document.createElement('div');
                  var contentStr = this._(key).prefix + "_tab-content";//

                  contentEl.className = contentStr;


                  //clear the parent node data
  				if(this._(key).clearHome == "true"){
  					bigDaddy.innerHTML = "";
  				}

                  bigDaddy.appendChild(listEl);
                  bigDaddy.appendChild(contentEl);

                  var listTarget = document.getElementsByClassName(listStr)[0];
                  var contentTarget = document.getElementsByClassName(contentStr)[0];

              var lengthVariable = this._(key).labels.length || 1;


              for(var i=0;i<lengthVariable;i++)
              {
                var optionId = this._(key).prefix + "_option" + i;
                var tabId = this._(key).prefix + "_option_tab" + i;

                  //tab links
                  var newListObj = document.createElement('li');
                  newListObj.className = this._(key).prefix + "_tab_line " + i + " tab_line " + this._(key).prefix + "_tab_line "
                  + this._(key).prefix + "_tab_line" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab_line" + this._(key).iUN + " ";//also in switchTabs

                  if(i == 0 && this._(key).type == "tabs"){/**/newListObj.className += " active "}
                  listTarget.appendChild(newListObj);

                  var newLinkObj = document.createElement('a');
                  newLinkObj.id = tabId;
                  newLinkObj.setAttribute('data-toggle','tab');
                  newLinkObj.setAttribute('href',optionId);
                  //newLinkObj.setAttribute('onclick','switchTabs()');//depreciated
                  newLinkObj.setAttribute('onclick',"minorButtons({'action':'switchTabs','objectName':'" + this._(key).objectName + "'})");
                  newLinkObj.setAttribute('data-option',optionId);
                  newLinkObj.setAttribute('data-tab',tabId);
                  var tabText = this._(key).labels[i] || "option " + (i+1);
                  newLinkObj.innerHTML = tabText;
                  newListObj.appendChild(newLinkObj);


                  //needs a matching class
                  //tab content area
                  var newTabObj = document.createElement('div');
                  newTabObj.id = optionId;
                  newTabObj.className = this._(key).prefix + "_tab-pane" + i + " tab-pane " + this._(key).prefix + "_tab-pane tCG "
                  + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab-pane" + this._(key).iUN + " " ;//also in switchTabs

                  if(i == 0){/**/ newTabObj.className += " active ";}
                  contentTarget.appendChild(newTabObj);

                  if(i == 0){/**/ newTabObj.style.display = "block";}
                  else{newTabObj.style.display = "none";}


              }//end for

          }//end tabContentDisplay
        }//end if


      if(typeof this.switchTabs != "function"){
        masterButtons.prototype.switchTabs = function()
        { //this.switchTabs
            var e = event || window.event;
            var current_tab = e.srcElement;
            var activeLink = current_tab.dataset.option;
            var activeTab = current_tab.dataset.tab;
            var tabGroupClass = this._(key).prefix + "_tab-pane" ;// + this._(key).iUN
            var tabGroup = document.getElementsByClassName(tabGroupClass);// too broad 'tCG'

            for(var i=0; i < tabGroup.length; i++)
            {
                /*bugfix - getting element by classname and display = none was
                doing somethingstrange blanking out the entire modal window
                so I switched to using id's here*/


                var optionStr = this._(key).prefix + "_option" + i;//content area
                var tabStr = this._(key).prefix + "_option_tab" + i;//tab area

                var prepDisplay = document.getElementById(optionStr);
                prepDisplay.className = this._(key).prefix + "_tab-pane" + i + " tab-pane " + this._(key).prefix + "_tab-pane tCG "
                + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab-pane" + this._(key).iUN + " " ;
                prepDisplay.style.display = "none";

                var prepTab = document.getElementById(tabStr);
                prepTab.className = this._(key).prefix + "_tab_line" + i + " tab_line " + this._(key).prefix + "_tab_line "
                + this._(key).prefix + "_tab_line" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab_line" + this._(key).iUN + "_";
                prepTab.style.border = "none";

            }//end for

            var setDisplay = document.getElementById(activeLink);
            setDisplay.className = this._(key).prefix + "_tab-pane" + i + " tab-pane " + this._(key).prefix + "_tab-pane tCG active "
            + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_";
            setDisplay.style.display = "block";

            var setTab = document.getElementById(activeTab);
            setTab.className += " active ";
            setTab.style.border = "1px solid #ccc";



        }//end switchTabs
      }//end if


      if(typeof this.tab_reset != "function"){
        masterButtons.prototype.tab_reset = function()
        {//var tab_reset

            var tabGroupClass = this._(key).prefix + "_tab-pane" ;// + this._(key).iUN
            var tabGroup = document.getElementsByClassName(tabGroupClass);// too broad 'tCG'

            for(var i=0; i < tabGroup.length; i++)
            {
                var optionStr = this._(key).prefix + "_option" + i;//content area
                var tabStr = this._(key).prefix + "_option_tab" + i;//tab area

               if(i == 0)
               {
                    var setDisplay = document.getElementById(optionStr);
                    setDisplay.className = this._(key).prefix + "_tab-pane" + i + " tab-pane " + this._(key).prefix + "_tab-pane tCG active "
                    + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_";
                    setDisplay.style.display = "block";

                    var setTab = document.getElementById(tabStr);
                    setTab.className += " active ";
                    setTab.style.border = "1px solid #ccc";
                }//end if
                else
                {
                    var prepDisplay = document.getElementById(optionStr);
                    prepDisplay.className = this._(key).prefix + "_tab-pane" + i + " tab-pane " + this._(key).prefix + "_tab-pane tCG "
                    + this._(key).prefix + "_tab-pane" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab-pane" + this._(key).iUN + " " ;
                    prepDisplay.style.display = "none";

                    var prepTab = document.getElementById(tabStr);
                    prepTab.className = this._(key).prefix + "_tab_line" + i + " tab_line " + this._(key).prefix + "_tab_line "
                    + this._(key).prefix + "_tab_line" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_tab_line" + this._(key).iUN + "_";
                    prepTab.style.border = "none";

                }//end else

            }//end for


        }//end tab_reset
      }//end if


    if(typeof this.listContentDisplay != "function"){
      masterButtons.prototype.listContentDisplay = function(nbr)
      {//var listContentDisplay
            /**************************************  Sample Code ****************************************
			      window['mIList'] = new masterButtons({varName:'mIList',home:'.mIOt_tab-pane1',type:'list'});
            mIList.setPrefix('mIList');
            mIList.setListNumber(4);
      			mIList.setCustomClass(["arc_select"]);
      			mIList.setInputAttributes({"placeholder":"enter a message title"});
            mIList.display();

      			var event_id = mIList.get_event_ids();
      			var targetElement = document.getElementById(fyi_event_id[0]);
      			targetElement.oninput = function(){
      			}
      			********************************************************************************************/

            //alert("data object is " + dataObject);
      			//mcust_option1 menu_custom_option
      			var list_el = (this._(key).type == "ul") ? "ul" : (this._(key).type == "ol") ? "ol" : (this._(key).type == "li") ? "li" : "div";

      			var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
      			//clears container
      			if(this._(key).clearHome == "true"){
      				bigDaddy.innerHTML = "";
      			}

      			var add_custom_class = (this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : " ";

            for(var i=0;i < this._(key).listNumber; i++)
            {
                var newObj = document.createElement(list_el);

                newObj.id = this._(key).prefix + "_ListArea" + "_" + i;// old id this._(key).prefix + "_ListArea" + this._(key).iUN + "_" + i;

        				this._(key).event_ids.push(newObj.id);

        				newObj.className = this._(key).prefix + "_ListArea" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_ListArea "  + this._(key).prefix + "_ListArea" + i + " ListArea " + add_custom_class;

        				//helps read setup setInputAttributes json parameters
        				for(var x = 0; x < this._(key).obj_attributes.length; x++)
        				{
        					var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
        					var pName = pNameAry[0];
        					newObj.setAttribute(pName,this._(key).obj_attributes[x][pName]);
        					//console.log(newObj);

        				}//end for

        				if(this._(key).fill_content != ""){newObj.innerHTML = this._(key).fill_content;}

                bigDaddy.appendChild(newObj);

            }//end for

              if(this._(key).has_callout == "true")
              {
                  newObj.onclick = function(e)
                  {
                    $("body").addClass("stop-scrolling");

                    if(this._(key).stop_event_bubble == "true")
                    {
                      e.stopPropagation();
                    }
                      e.preventDefault();
                    //this._(key).my_preventDefault(e)

                    if(e.target.id == this.id || this._(key).stop_event_bubble == "false")
        						{
                      var callout_fn = this._(key).callout_params[0];
                      callout_fn(e,this.id,this._(key).callout_params[1],this._(key).callout_params[2],this._(key).callout_params[3],this._(key).callout_params[4],this._(key).callout_params[5]);

        						}//end if


                  };
              }//end if

          }//end listContentDisplay
        }//end if

        this._(key).my_preventDefault = function(e)
          {//var my_preventDefault
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
          }//end my_preventDefault


      if(typeof this.textContentDisplay != "function"){
        masterButtons.prototype.textContentDisplay = function()
        {//var textContentDisplay
      			/************************************* Sample Code ******************************************
      			window['exTxt'] = new masterButtons({varName:'exTxt',home:'.mIList_ListArea2',type:'text_box'});
      			exTxt.setLabels(['Other options:']);
      			exTxt.setTextTag('h4');
      			exTxt.setPrefix('exTxt');
      			exTxt.display();

      			var event_id = exTxt.get_event_ids();
      			var targetElement = document.getElementById(fyi_event_id[0]);
      			targetElement.oninput = function(){
      			}
      			*********************************************************************************************/

            //alert("data object is " + dataObject);
            //gets container

      			if(this._(key).labels == undefined || this._(key).labels == [] || this._(key).labels[0] == "")
                  {
                          alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
      					return;
      			}


           var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //clears container
      			if(this._(key).clearHome == "true"){
      				bigDaddy.innerHTML = "";
            }

            for(var i=0;i < this._(key).labels.length; i++)
            {
                var newObj = document.createElement(this._(key).text_tag);
                newObj.className = this._(key).prefix + "_TTag" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TTag "  + this._(key).prefix + "_TTag" + i + " TTag ";
                newObj.id = this._(key).prefix + "_TTag" + this._(key).iUN + "_" + i;

                if(this._(key).labels[i] == undefined || this._(key).labels[i] == "")
                {
                    alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
                }else
                {
                    newObj.innerHTML = this._(key).labels[i];
                    newObj.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";
                    bigDaddy.appendChild(newObj);
                }//end else
            }//end for

        }//end textContentDisplay
      }//end if


      if(typeof this.labelBoxDisplay != "function"){
        masterButtons.prototype.labelBoxDisplay = function()
        {//var labelBox

			     /********************************  Sample Code  *****************************************
			      window['exTxt2'] = new masterButtons({varName:'exTxt2',home:'.mIList_ListArea3',type:'label_box'});
            exTxt2.setLabels(['Link:']);
            exTxt2.setTextTag('h4');
            exTxt2.setPrefix('exTxt2');
            exTxt2.display();
			     ***************************************************************************************/

            //alert("data object is " + dataObject);
            //gets container
      			if(this._(key).labels == undefined || this._(key).labels == [] || this._(key).labels[0] == "")
            {
                alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
      					return;
      			}

           var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //clears container
    				if(this._(key).clearHome == "true"){
    					bigDaddy.innerHTML = "";
    				}

            for(var i=0;i < this._(key).labels.length; i++)
            {
                var newTag = document.createElement(this._(key).text_tag);
                newTag.className = this._(key).prefix + "_LBTag" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_LBTag "  + this._(key).prefix + "_LBTag" + i + " LBTag ";
                newTag.id = this._(key).prefix + "_LBTag" + "_" + i;

                var newLBox = document.createElement('div');
                newLBox.className = this._(key).prefix + "_LBox" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_LBox "  + this._(key).prefix + "_LBox" + i + " LBox ";
                newLBox.id = this._(key).prefix + "_LBox" + "_" + i;

			          var newClr = document.createElement('div');
                newClr.className = this._(key).prefix + "_Clear" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_Clear "  + this._(key).prefix + "_Clear" + i + " Clear clear clr";
                newClr.id = this._(key).prefix + "_Clear" + "_" + i;

			          if(this._(key).fill_content != ""){newLBox.innerHTML = this._(key).fill_content;}

                if(this._(key).labels[i] == undefined || this._(key).labels[i] == "")
                {
                    alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
                }else
                {
                    newTag.innerHTML = this._(key).labels[i];
                    newTag.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";
                    bigDaddy.appendChild(newTag);
                    bigDaddy.appendChild(newLBox);
				            if(this._(key).set_clear = "true"){bigDaddy.appendChild(newClr);}

                }//end else
            }//end for



        }//end labelBoxDisplay
      }//end if

      if(typeof this.tagDisplay != "function"){
        masterButtons.prototype.tagDisplay = function()
        {//var tagDisplay
          //BKA AKA html tag display

      			/********************************  Sample Code  *****************************************
      			window['exTxt2'] = new masterButtons({varName:'exTxt2',home:'mIList_ListArea3',type:'tag'}); //html tag display
      			exTxt2.setTextTag('h4');
                  exTxt2.setPrefix('exTxt2');
      			exTxt2.setCustomClass(["clr clear"]);
      			exTxt2.setContent('text content');
      			exTxt2.clearHome("false");
            exTxt2.setMaxLength(2);
                  exTxt2.display();
      			***************************************************************************************/

            //alert("data object is " + dataObject);
            //gets container
          var vKey = this._(key);
           var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //clears container
    				if(this._(key).clearHome == "true"){
    					bigDaddy.innerHTML = "";
    				}

    				var add_custom_class = (this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

    				var newTag = document.createElement(this._(key).text_tag);
    				newTag.id = this._(key).prefix + "_TDTag" + "_" + i;

    				this._(key).event_ids.push(newTag.id);

    				newTag.className = this._(key).prefix + "_TDTag" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TDTag "  + this._(key).prefix + "_LBTag" + i + " LBTag " + add_custom_class;

            this._(key).fill_content = (this._(key).maxlength != "default" && this._(key).fill_content.length > parseInt(this._(key).maxlength)) ? this._(key).fill_content.slice(0,this._(key).maxlength) : this._(key).fill_content;

    				if(this._(key).fill_content != ""){newTag.innerHTML = this._(key).fill_content;}

            for(var x = 0; x < this._(key).obj_attributes.length; x++)
            {
              var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
              var pName = pNameAry[0];
              newTag.setAttribute(pName,this._(key).obj_attributes[x][pName]);
              //console.log(newObj);

            }//end for

            if(this._(key).has_callout == "true")
            {
                newTag.onclick = function(e)
                {
                  $("body").addClass("stop-scrolling");

                  if(vKey.stop_event_bubble == "true")
                  {
                    e.stopPropagation();
                  }
                    e.preventDefault();
                  //vKey.my_preventDefault(e)
                  vKey.click_count++;



                  if(vKey.has_double != "true"){
                    if(vKey.click_count > 1){return;}
                    console.log("click count = ",vKey.click_count);
                    if(e.target.id == this.id || vKey.stop_event_bubble == "false")
                    {
                      var callout_fn = vKey.callout_params[0];
                      if(vKey.pass_event == "false")
                      {
                        callout_fn(e,this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);
                      }else {
                        callout_fn(e,this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);
                      }
                    }//end if

                    vKey.click_count = 0;

                  }else {
                    //this creates the ability to toggle between click & dblclick
                    let move_element = e.target;
                    var hold_time = 500;
                    var use_event = ("ontouch" in move_element) ? "touch" : "click";
                    let event_el = e.target;
                    let this_el = this;

                    if(vKey.click_count > 1)
                    {
                      //this creates a timer to protect from overclicking -
                      //the timer starts over and doesn't reset the click count with each click
                      //only not clicking resets the click count to 0
                      vKey.click_timer = setTimeout(function(){
                        vKey.click_count = 0;
                        clearTimeout(vKey.click_timer);
                      }, 3000);
                    }//end if

                    if(vKey.click_count > 2){return;}
                    console.log("click count = ",vKey.click_count);


                    if(vKey.double_status != "start")
                    {
                      vKey.double_status = "start";

                      vKey.double_timer = setTimeout(function(){

                        if(e.target.id == this.id || vKey.stop_event_bubble == "false")
                        {
                          var callout_fn = vKey.callout_params[0];
                          if(vKey.pass_event == "false")
                          {
                            callout_fn(e,this_el.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);
                          }else {
                            callout_fn(e,this_el.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);
                          }//end else pass_event
                        }//end if
                        vKey.double_status = "reset";
                        vKey.click_count = 0;
                        console.log("click count reset = ",vKey.click_count)
                      }, hold_time);
                    }else{

                      console.log(vKey.double_timer);
                      clearTimeout(vKey.double_timer);
                      if(event_el.id == this_el.id || vKey.stop_event_bubble == "false")
                      {
                        var double_fn = vKey.double_params[0];
                        if(vKey.pass_event == "false")
                        {
                        double_fn(e,this_el.id,vKey.double_params[1],vKey.double_params[2],vKey.double_params[3],vKey.double_params[4],vKey.double_params[5]);
                        }else {
                          double_fn(e,this_el.id,vKey.double_params[1],vKey.double_params[2],vKey.double_params[3],vKey.double_params[4],vKey.double_params[5]);
                        }
                      }//end if

                      vKey.double_status = "reset";
                      //vKey.click_count = 0;
                    }//end else
                    //alert("use_event = " + use_event);
                  }//end else



                };
            }//end if

            if(this._(key).has_alt_callout == "true")
            {
              this._(key).alt_event = this._(key).test_event(this._(key),newTag,this._(key).alt_event);

              newTag.addEventListener(this._(key).alt_event,function(e)
              {
                if(vKey.has_alt_callout == "true")
                {
                    var alt_callout_fn = vKey.alt_callout_params[0];
                    alt_callout_fn(e,newTag.id,vKey.alt_callout_params[1],vKey.alt_callout_params[2],vKey.alt_callout_params[3],vKey.alt_callout_params[4],vKey.alt_callout_params[5]);

                }//end if
              });//end onclick

            }//end if has_alt_callout




            bigDaddy.appendChild(newTag);


        }//end tagDisplay
      }//end if



        //this is split into two parts just in case the container has to be filled with something else and erases its
        //contents before it fills it.
      if(typeof this.moveElements != "function"){
        masterButtons.prototype.moveElements = function()
        {//var moveElements
            this._(key).moveType = "contents";
            //this is where its coming from
            //var tarEl = this._(key).prepElementStringType(this._(key).move_target_str);//tarEl = target elements
            this._(key).move_target = this._(key).move_target_str;//tarEl.target;
            //move_element_type = tarEl.type;

            //locates the focus/target of the move
            var targetCont = (/*move_element_type == "class"*/ document.getElementById(this._(key).move_target)) ? document.getElementById(this._(key).move_target) : document.getElementsByClassName(this._(key).move_target)[0];

            //stores the contents here
            this._(key).target_contents = targetCont.innerHTML;

      			//blank out the Original location?
      			targetCont.innerHTML = "";

        }//end moveElements
      }//end if

      if(typeof this.moveElement != "function"){
        masterButtons.prototype.moveElement = function()
        {//var moveElement
            this._(key).moveType = "element";
            //this is where its coming from
            //var tarEl = this._(key).prepElementStringType(this._(key).move_target_str);//tarEl = target elements

            //this._(key).move_target = this._(key).move_target_str;//tarEl.target;
              var move_target = this._(key).move_target_str;
            //move_element_type = tarEl.type;

            //locates the focus/target of the move
            var targetCont = (document.getElementById(move_target)) ? document.getElementById(move_target) :  document.getElementsByClassName(move_target)[0];

            //stores the contents here
            this._(key).target_contents = targetCont;
            //targetCont.cloneNode(true);

        }//end moveElement
      }//end if


      if(typeof this.move != "function"){
        masterButtons.prototype.move = function(str)
        {//this.move
          /*
          //sample
          window['movEl1'] = new masterButtons({varName:'movEl1',home:'#modTb_option0',type:'move_element'});
          movEl1.setMoveTarget('.the_sweat_lodge');
          movEl1.display();

          //do something

          movEl1.move();
          */
            //home and bigDaddy is where its going
            var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //also the home may not exist yet when you call the moveElement section
            var modifier = str || "";
            //moves the elements

            switch(this._(key).moveType)
            {
                case "contents":
                    if(modifier == "add")
                    {
                        bigDaddy.innerHTML += this._(key).target_contents;
                    }else
                    {
                        bigDaddy.innerHTML = this._(key).target_contents;
                    }
                break;

                case "element":
                    if(modifier == "add")
                    {
                        bigDaddy.appendChild(this._(key).target_contents);
                    }else
                    {
                        bigDaddy.innerHTML = "";
                        bigDaddy.appendChild(this._(key).target_contents);
                    }
                break;

            }

            //destroy the evidence
            //targetCont.innerHTML = "";
             //no need to do any erasing
        }//end move
      }//end if

      this._(key).test_event = function(vKey,elmnt,str)
      {
        var event_array = ["mousedown","mouseup","mouseover","mouseout"]
        //onmouseover,onmousedown - ontouchstart
        //onmousemove - ontouchmove
        //onmouseout, onmouseup - ontouchend
        var return_value = "";
        var mobile_version = "";
        var full_m_v = "";

        //check for on
        var full_event_name = (str.indexOf("on") == -1) ? "on" + str : str;
        var partial_event_name =  (str.indexOf("on") != -1) ? str.replace("on","") : str;
        var is_in_array = vKey._checkArray({'string':str,'array':event_array});

        if(is_in_array == -1)
        {
          return partial_event_name;
        }else {

          //test for mobile version
          switch(partial_event_name){
            case "mousedown":
            case "mouseover":
                  mobile_version = "touchstart";
                  full_m_v = "on" + mobile_version;
            break;

            case "mousemove":
                  mobile_version = "touchmove";
                  full_m_v = "on" + mobile_version;
            break;

            case "mouseout":
            case "mouseup":
                  mobile_version = "touchend";
                  full_m_v = "on" + mobile_version;
            break;


          }//end switch

          return return_value = (full_m_v in elmnt) ? mobile_version : partial_event_name;

        }//end else

      }//end test_event

      if(typeof this.reset != "function"){
        masterButtons.prototype.reset = function()
        {//this.reset
            switch(this._(key).type)
            {

                case "buttongroup":
                    //button reset
                    var setting = "";

                    if(this._(key).start != "" && this._(key).start != undefined)
                    {
                        setting = this._(key).start;
                    }else
                    {
                        setting = this._(key).labels[0];
                    }
                    //set button classname to initial setting
                    for(var i = 0; i < this._(key).labels.length; i++)
                    {
                        var groupClass = this._(key).prefix + "_btn_group";
                        var buttonGroup = document.getElementsByClassName(groupClass);
                        var targBtn = document.getElementsByClassName(groupClass)[i];
                        targBtn.className = "btn " + this._(key).prefix + "_btn_group " + this._(key).prefix + "_btn_group" + i + " "
                        + this._(key).prefix + "_btn_group" + this._(key).iUN + " " + this._(key).prefix + "_btn_group" + this._(key).iUN + "_" + i + " ";
                        if(targBtn.dataset.value == setting)
                        {
                            targBtn.className += " active ";
                        }//end if



                    }//end for

                break;

                case "tabs":

                this.tab_reset();

                break;

                case "pills":

                this.tab_reset();

                break;

            }
        }//end reset
      }//end if

		//TODO:100 Needs a reset
    if(typeof this.create_text_input != "function"){
      masterButtons.prototype.create_text_input = function()
  		{//var create_text_input
  			/************************************* Sample Code ******************************************
  			window['exTxt'] = new masterButtons({varName:'exTxt',home:'.mIList_ListArea2',type:'text'});
  			exTxt.setLabels(['Title:']);
  			exTxt.setTitles(['Message title']);
  			exTxt.setPlaceholders(['Enter a Message title']);//can manage for multiple entries
  			exTxt.setPrefix('exTxt');
  			exTxt.setText('Anything');
  			testTxt.setInputAttributes({"placeholder":"enter a message title"});//another way to set placeholder - single entry for now
  			exTxt.setInputAttributes({"maxlength":10});
  			exTxt.setInputAttributes({"required":true});
        exTxt.setInputIcon('plus');
  			exTxt.display();

  			var event_id = exTxt.get_event_ids();
  			var targetElement = document.getElementById(fyi_event_id[0]);
  			targetElement.oninput = function(){
  			}

  			*********************************************************************************************/

  			 //alert("data object is " + dataObject);
              //gets container
              var vKey = this._(key);
              var input_icon_class = "";
                 var bigDaddy = (/*stringType == "class"*/document.getElementById(vKey.home)) ? document.getElementById(vKey.home) : document.getElementsByClassName(this._(key).home)[0];
                  //clears container
  				if(this._(key).clearHome == "true"){
  					bigDaddy.innerHTML = "";
  				}

                  for(var i=0; i < this._(key).labels.length; i++)
                  {

                      if(this._(key).labels[i] == undefined)
                      {
  						//deprecated
                          alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
                      }else
                      {
  						var add_custom_class = (this._(key).custom_class.length > 1) ? " " + this._(key).custom_class[i] + " " :(this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

  						//casing
  						if(this._(key).casing != "false"){

  							var newObj_casing = document.createElement('div');
  							newObj_casing.id = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i;
  							newObj_casing.className = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TCasing "  + this._(key).prefix + "_TCasing" + i + " TCasing " + add_custom_class;

  						}//end if casing




  						var newObj_label = document.createElement('label');
  						newObj_label.id = this._(key).prefix + "_TLabel" + this._(key).iUN + "_" + i;

  						if(this._(key).has_labels == "true"){

  						newObj_label.className = this._(key).prefix + "_TLabel" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TLabel "  + this._(key).prefix + "_TLabel" + i + " TLabel " + add_custom_class;
  						newObj_label.setAttribute("for",this._(key).prefix + "_TInput" + this._(key).iUN + "_" + i);
  						newObj_label.innerHTML = this._(key).labels[i];
  						newObj_label.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

  						}else{
  						newObj_label.style.display = "none";
  						}

              if(this._(key).input_icon != "false")
              {
                input_icon_class += " input-icon-" + this._(key).icon_dir;

                var newObj_icon_cont = document.createElement('div');
                newObj_icon_cont.id = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i;
                newObj_icon_cont.className = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_ICont "  + this._(key).prefix + "_ICont" + i + " ICont " + add_custom_class + input_icon_class;


                if(this._(key).has_alt_callout != "true")
                {
                  //may just need it for show like with a filters magnifying glass - if its just for show do this.
                  input_icon_class += " ui-icon-" + this._(key).input_icon + " ";
                }//end if

              }//end if

  						var newObj_txt_cont = document.createElement('div');
  						newObj_txt_cont.id = this._(key).prefix + "_TCont" + this._(key).iUN + "_" + i;
  						newObj_txt_cont.className = this._(key).prefix + "_TCont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TCont "  + this._(key).prefix + "_TCont" + i + " TCont " + add_custom_class;


                //preserve_entry && rerun are used when a display mode is switched and you need the data to remain persistent
                if(this._(key).object_elements.newObj_input != undefined && this._(key).preserve_entry != false){this._(key).rerun = "true";}
  							this._(key).object_elements.newObj_input = (this._(key).object_elements.newObj_input != undefined && this._(key).preserve_entry != false) ? this._(key).object_elements.newObj_input : document.createElement('input');
  							this._(key).object_elements.newObj_input.id = (this._(key).id_type == "custom") ? this._(key).custom_id :this._(key).prefix + "_TInput" + this._(key).iUN + "_" + i;

  							this._(key).event_ids.push(this._(key).object_elements.newObj_input.id);

  							this._(key).object_elements.newObj_input.className = this._(key).prefix + "_TInput" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TInput "  + this._(key).prefix + "_TInput" + i + " TInput " + add_custom_class;
  							this._(key).object_elements.newObj_input.setAttribute("type","text");
                this._(key).object_elements.newObj_input.onfocus = ()=>{this._(key).object_elements.newObj_input.select();}



                if(this._(key).has_alt_callout == "true" && this._(key).input_icon != "false")
                {
                  //this is for a something like a clear btn "x"  that sits next to the text input
                  var inBtn_icon_class =  " ui-icon-" + this._(key).input_icon + " ";

                  var newObj_input_btn = document.createElement('div');
                  newObj_input_btn.id = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i;
                  newObj_input_btn.className = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_inBtn "  + this._(key).prefix + "_inBtn" + i + " inBtn " + add_custom_class + inBtn_icon_class;

                  this._(key).alt_event = this._(key).test_event(this._(key),this._(key).object_elements.newObj_input,this._(key).alt_event);

                  newObj_input_btn.addEventListener(this._(key).alt_event,function(e)
                  {
                    if(this._(key).has_alt_callout == "true")
                    {
                        var alt_callout_fn = this._(key).alt_callout_params[0];
                        alt_callout_fn(e,this._(key).object_elements.newObj_input.id,this._(key).alt_callout_params[1],this._(key).alt_callout_params[2],this._(key).alt_callout_params[3],this._(key).alt_callout_params[4],this._(key).alt_callout_params[5]);

                    }//end if
                  });//end onclick

                }//end if has_alt_callout

  							var newPlace = (this._(key).placeholders[i] != undefined) ? this._(key).placeholders[i] : "";

  							//newObj_label.type = () ? "tel" : "";


  							if(newPlace != ""){
  								this._(key).object_elements.newObj_input.setAttribute("placeholder",newPlace);
  							}

  							if(this._(key).inner_html != "" && this._(key).rerun != "true"){
  								this._(key).object_elements.newObj_input.value = this._(key).inner_html;
  							}

  							//helps read setup setInputAttributes json parameters
  							for(var x = 0; x < this._(key).obj_attributes.length; x++)
  							{
  								var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
  								var pName = pNameAry[0];
  								this._(key).object_elements.newObj_input.setAttribute(pName,this._(key).obj_attributes[x][pName]);
  								//console.log(newObj_input);

  							}//end for

  							this._(key).object_elements.newObj_input.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

  							this._(key).object_elements.newObj_txt_tally = document.createElement('div');
  							this._(key).object_elements.newObj_txt_tally.id = this._(key).prefix + "_TTly" + this._(key).iUN + "_" + i;
  							this._(key).object_elements.newObj_txt_tally.className = this._(key).prefix + "_TTly" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TTly "  + this._(key).prefix + "_TTly" + i + " TTly " + add_custom_class;
                this._(key).object_elements.newObj_txt_tally.style.display = "none";//this fixes the tally show bug

                character_limit = (this._(key).object_elements.newObj_input.attributes.maxlength != undefined) ? this._(key).object_elements.newObj_input.attributes.maxlength.value : 25;

  							this._(key).data_check_array = this._(key).data_check_array.concat({"msg_id":this._(key).object_elements.newObj_txt_tally.id,"input_id":this._(key).object_elements.newObj_input.id,"char_limit":character_limit,"type":this._(key).type});

  							this._(key).object_elements.newObj_input.oninput = function(e)
                {
  								character_limit = (vKey.object_elements.newObj_input.attributes.maxlength != undefined) ? vKey.object_elements.newObj_input.attributes.maxlength.value : 25;

  								var in_id =  vKey.object_elements.newObj_input.id;
  								var ms_id = vKey.object_elements.newObj_txt_tally.id;

                  if(vKey.object_elements.newObj_input.value == "")
                  {
                    vKey.object_elements.newObj_txt_tally.style.display = "none";
                  }else
                  {
                    vKey.object_elements.newObj_txt_tally.style.display = "block";
                  }//end else

  								vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":vKey.type});

  								vKey.extractData(vKey,vKey.object_elements.newObj_input.id,vKey.type);

                  if(vKey.has_callout == "true")
                  {
                      var callout_fn = vKey.callout_params[0];
                      callout_fn(e,this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                  }//end if
  							};


              //this section places the icon btn before or after the input element based on the icon_dir (direction)
              if(this._(key).input_icon != "false")
              {
                //put the input into the input icon container
                newObj_icon_cont.appendChild(this._(key).object_elements.newObj_input);

                //if there is an alt callout manage the button placement
                if(this._(key).has_alt_callout == "true")
                {
                  if(this._(key).icon_dir == "right")
                  {
                    newObj_icon_cont.appendChild(newObj_input_btn);
                  }else
                  {
                    newObj_icon_cont.insertBefore(newObj_input_btn,this._(key).object_elements.newObj_input);
                  }//end else

                }//end if

                newObj_txt_cont.appendChild(newObj_icon_cont);

              }else {
                newObj_txt_cont.appendChild(this._(key).object_elements.newObj_input);
              }

  						newObj_txt_cont.appendChild(this._(key).object_elements.newObj_txt_tally);

  						if(this._(key).casing != "false"){
  							newObj_casing.appendChild(newObj_label);
  							newObj_casing.appendChild(newObj_txt_cont);
  							bigDaddy.appendChild(newObj_casing);
  						}else{
  							bigDaddy.appendChild(newObj_label);
  							bigDaddy.appendChild(newObj_txt_cont);
  						}

                      }//end else

  					this._(key).extractData(this._(key),this._(key).object_elements.newObj_input.id,this._(key).type);

                  }//end for




  		}//end create_text_input
    }//end if


    if(typeof this.create_textarea != "function"){
      masterButtons.prototype.create_textarea = function()
  		{//var create_textarea
  			/************************************* Sample Code ******************************************
  			window['exTxt'] = new masterButtons({varName:'exTxt',home:'.mIList_ListArea2',type:'textarea'});
  			exTxt.setLabels(['Title:']);
  			exTxt.setTitles(['Message title']);
  			exTxt.setPlaceholders(['Enter a Message title']);
  			exTxt.setPrefix('exTxt');
  			exTxt.setCustomClass(["arc_select"]);
  			exTxt.setInputAttributes({"required":true});
  			exTxt.setCasing();
  			exTxt.clearHome("false");
  			exTxt.display();

  			var event_id = exTxt.get_event_ids();
  			var targetElement = document.getElementById(fyi_event_id[0]);
  			targetElement.oninput = function(){
  			}

        //texteditor site
        https://www.tinymce.com

        //texteditor requires this link
        "https://cloud.tinymce.com/stable/tinymce.min.js"
  			*********************************************************************************************/

  			  //alert("data object is " + dataObject);
          //gets container
          var vKey = this._(key);
          var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
          //clears container
  				if(this._(key).clearHome == "true"){
  					bigDaddy.innerHTML = "";
  				}

          for(var i=0;i < this._(key).labels.length; i++)
          {

              if(this._(key).labels[i] == undefined)
              {
  		            //deprecated
                  alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
              }else
              {
      						var add_custom_class = (this._(key).custom_class.length > 1) ? " " + this._(key).custom_class[i] + " " :(this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

      						if(this._(key).casing != "false"){

      							var newObj_casing = document.createElement('div');
      							newObj_casing.id = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i;
      							newObj_casing.className = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TCasing "  + this._(key).prefix + "_TCasing" + i + " TCasing " + add_custom_class;

      						}//end if casing



      						var newObj_label = document.createElement('label');
      						newObj_label.id = this._(key).prefix + "_TAreaLabel" + this._(key).iUN + "_" + i;

      						if(this._(key).has_labels == "true"){

      						newObj_label.className = this._(key).prefix + "_TAreaLabel" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TAreaLabel "  + this._(key).prefix + "_TAreaLabel" + i + " TAreaLabel " + add_custom_class;
      						newObj_label.setAttribute("for",this._(key).prefix + "_TArea" + this._(key).iUN + "_" + i);
      						newObj_label.innerHTML = this._(key).labels[i];
      						newObj_label.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

      						}else{newObj_label.style.display = "none";}

      						var newObj_txt_cont = document.createElement('div');
      						newObj_txt_cont.id = this._(key).prefix + "_TAreaCont" + this._(key).iUN + "_" + i;
      						newObj_txt_cont.className = this._(key).prefix + "_TAreaCont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TAreaCont "  + this._(key).prefix + "_TAreaCont" + i + " TAreaCont " + add_custom_class;

                  if(vKey.text_editor == "quill")
                  {
                    var newObj_quill = document.createElement('div');
                    newObj_quill.id = this._(key).prefix + "_quill_span" + this._(key).iUN + "_" + i;
                    newObj_quill.className = this._(key).prefix + "_quill_span" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_quill_span "  + this._(key).prefix + "_quill_span" + i + " _quill_span quill " + add_custom_class;
                  }//end if quill
                  //late comment i believe this protects from duplicates?
                  if(this._(key).object_elements.newObj_textarea != undefined && this._(key).preserve_entry != false){this._(key).rerun = "true";}
    							this._(key).object_elements.newObj_textarea = (this._(key).object_elements.newObj_textarea != undefined && this._(key).preserve_entry != false) ? this._(key).object_elements.newObj_textarea : document.createElement('textarea');
    							this._(key).object_elements.newObj_textarea.id = (this._(key).id_type == "custom") ? this._(key).custom_id : this._(key).prefix + "_TArea" + this._(key).iUN + "_" + i;


    							this._(key).event_ids.push(this._(key).object_elements.newObj_textarea.id);

    							this._(key).object_elements.newObj_textarea.className = this._(key).prefix + "_TArea" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TArea "  + this._(key).prefix + "_TArea" + i + " TArea summernote " + add_custom_class;

    							var newPlace = (this._(key).placeholders[i] != undefined) ? this._(key).placeholders[i] : "";
    							this._(key).object_elements.newObj_textarea.setAttribute("placeholder",newPlace);
    							this._(key).object_elements.newObj_textarea.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";
                  this._(key).object_elements.newObj_textarea.onfocus = ()=>{this._(key).object_elements.newObj_textarea.select();}

                  if(this._(key).edit_object != undefined && this._(key).edit_object != {} && this._(key).edit_object.text != ""/*this._(key).rerun != "true"*/){
    								this._(key).object_elements.newObj_textarea.value = this._(key).edit_object.text;
    							}

    							//helps read setup setInputAttributes json parameters
    							for(var x = 0; x < this._(key).obj_attributes.length; x++)
    							{
    								var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
    								var pName = pNameAry[0];
    								this._(key).object_elements.newObj_textarea.setAttribute(pName,this._(key).obj_attributes[x][pName]);
    								//console.log(this._(key).object_elements.newObj_textarea);

    							}//end for

    							var newObj_txt_tally = document.createElement('div');
    							newObj_txt_tally.id = this._(key).prefix + "_TAreaTly" + this._(key).iUN + "_" + i;
    							newObj_txt_tally.className = this._(key).prefix + "_TAreaTly" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TAreaTly "  + this._(key).prefix + "_TAreaTly" + i + " TAreaTly " +  add_custom_class;

    							character_limit = this._(key).object_elements.newObj_textarea.attributes.maxlength.value || "";

    							this._(key).data_check_array = this._(key).data_check_array.concat({"msg_id":newObj_txt_tally.id,"input_id":this._(key).object_elements.newObj_textarea.id,"char_limit":character_limit,"type":this._(key).type});

    							//msg_id input_id char_limit
    							this._(key).object_elements.newObj_textarea.oninput = function(e)
                  {
    								character_limit = vKey.object_elements.newObj_textarea.attributes.maxlength.value || "";
    								var in_id =  vKey.object_elements.newObj_textarea.id;
    								var ms_id = newObj_txt_tally.id;

    								vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":vKey.type});

    								vKey.extractData(vKey,vKey.object_elements.newObj_textarea.id,vKey.type);

                    if(vKey.has_callout == "true")
                    {
                        var callout_fn = vKey.callout_params[0];
                        callout_fn(this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                    }//end if
    							};

                  if(vKey.text_editor == "quill"){newObj_txt_cont.appendChild(newObj_quill);}
      						newObj_txt_cont.appendChild(this._(key).object_elements.newObj_textarea);
      						newObj_txt_cont.appendChild(newObj_txt_tally);

      						if(this._(key).casing != "false"){
      							newObj_casing.appendChild(newObj_label);
      							newObj_casing.appendChild(newObj_txt_cont);
      							bigDaddy.appendChild(newObj_casing);
      						}else{
      							bigDaddy.appendChild(newObj_label);
      							bigDaddy.appendChild(newObj_txt_cont);
      						}

                  if(vKey.type == "texteditor" || vKey.type == "textlog")
                  {
                      let j_selector_id = this._(key).object_elements.newObj_textarea.id;
                      let j_selector_jq = "#" + j_selector_id;

                    switch(vKey.text_editor)
                    {
                      case "nicedit":
                        /**********************************    NICEDIT SECTION     *************************************/
                        //if(document.getElementsByClassName("nicEdit-main")[0])return;

                        this._(key).object_elements.newObj_textarea.setAttribute("cols","200");
                        let niceley = new nicEditor({"width":"100%",iconsPath : 'js/nicedit/nicEditorIcons.gif'}).panelInstance(j_selector_id);
                        niceley.addEvent('blur', function() {
                          if(niceley.instanceById(j_selector_id) != undefined)
                          {
                            //this if protects from errors when switching back to regular textarea modern
                            //the niceley addevent isn't destroyed on the changeover

                            //alert( niceley.instanceById(j_selector).getContent() );
                            console.log(niceley.instanceById(j_selector_id).getContent());
                            vKey.object_elements.newObj_textarea.value = niceley.instanceById(j_selector_id).getContent();
                            console.log(vKey.object_elements.newObj_textarea.value);

                              let character_limit = vKey.object_elements.newObj_textarea.attributes.maxlength.value || "";
              								let in_id =  vKey.object_elements.newObj_textarea.id;
              								let ms_id = newObj_txt_tally.id;

              								vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":vKey.type});

              								vKey.extractData(vKey,vKey.object_elements.newObj_textarea.id,vKey.type);
                          }//end if niceley.instanceById(j_selector)
                        });

                        let child0 = newObj_txt_cont.childNodes[0];
                        child0.className = "nice_size";

                        newObj_txt_cont.childNodes[1].className = "nice_size";
                        //let child1 =  child1.className = "nice_size";
                        /**********************************    NICEDIT SECTION     *************************************/
                        break;

                      case "tinymce":

                    /*************    TINYMCE SECTION     *************/

                          //my custom tinymce section
                          let tiny_options = {
                          selector: j_selector_jq,
                          branding:false,
                          theme: 'modern',
                          /*content_style: ".mce-content-body {font-size:12px;font-family:Arial,sans-serif;}",*/
                          setup : function(ed) {
                           ed.on('init', function(ed) {
                            /*ed.target.editorCommands.execCommand("fontName", false, "Calibri");*/
                            ed.target.editorCommands.execCommand("fontSize", false, "12pt");
                           });
                          },
                          /*inline: true,
                          fixed_toolbar_container: '#arc_hidden_cont',*/
                          plugins: [
                            "advlist autolink autosave lists charmap print preview hr anchor pagebreak codesample ",
                            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking",
                            "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                          ],
                          autosave_retention: "30m",
                          toolbar_items_size: 'small',
                          /*templates: [
                            { title: 'Test template 1', content: 'Test 1' },
                            { title: 'Test template 2', content: 'Test 2' }
                          ],*/
                          content_css: [
                            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                            '//www.tinymce.com/css/codepen.min.css'
                          ]
                        };

                        if(vKey.type != "textlog"){
                        tiny_options.height = 245;
                        tiny_options.menubar = "edit format insert";
                        tiny_options.toolbar1 = "newdocument | bullist numlist | outdent indent | table | codesample | forecolor | code | undo redo | insertdatetime | fontselect  fontsizeselect ";
                        }else {
                        tiny_options.height = 310;
                        tiny_options.menubar = false;
                        tiny_options.menubar = "edit format";
                        tiny_options.toolbar1 = "newdocument | undo redo | bullist numlist | insertdatetime ";
                        }//end else

                          tinymce.init(tiny_options);

                        if(tinymce.get(j_selector_id) && vKey.edit_object != undefined && vKey.edit_object.html != "")
                        {
                          tinymce.get(j_selector_id).setContent(vKey.edit_object.html);//formerly vKey.inner_html
                          vKey.object_elements.newObj_textarea.value = tinymce.get(j_selector_id).getContent({format: 'raw'});

                          let character_limit = vKey.object_elements.newObj_textarea.attributes.maxlength.value || "";
                          let in_id =  vKey.object_elements.newObj_textarea.id;
                          let ms_id = newObj_txt_tally.id;

                          vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":vKey.type});

                        }

                        tinymce.get(j_selector_id).on('input blur', function(e) {
                           //console.log('Hello world!');
                           //this if protects from errors when switching back to regular textarea modern
                           //the niceley addevent isn't destroyed on the changeover

                           //alert( niceley.instanceById(j_selector).getContent() );
                           console.log(tinymce.get(j_selector_id).getBody().textContent);//{format : 'raw'} shows no difference
                           vKey.object_elements.newObj_textarea.value = tinymce.get(j_selector_id).getContent({format: 'html'});
                           let v_value = vKey.object_elements.newObj_textarea.value;
                           //console.log(v_value);

                             let character_limit = vKey.object_elements.newObj_textarea.attributes.maxlength.value || "";
                             let in_id =  vKey.object_elements.newObj_textarea.id;
                             let ms_id = newObj_txt_tally.id;

                             vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":vKey.type});

                             vKey.extractData(vKey,vKey.object_elements.newObj_textarea.id,vKey.type);

                             if(vKey.has_callout == "true")
                             {
                                 var callout_fn = vKey.callout_params[0];
                                 callout_fn(e,this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                             }//end if
                        });

                        /*
                        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
                        image_advtab: true,
                        */

                        /*tinymce.init({
                        selector: j_selector,
                        height: 200,
                        plugins: [
                          "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak codesample ",
                          "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                          "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                        ],

                        toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect | formatselect | fontselect ",
                        toolbar2: "fontsizeselect |  undo redo insertdatetime | bullist numlist | outdent indent blockquote | link unlink anchor image media code | forecolor backcolor codesample ",
                        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print | ltr rtl | visualchars visualblocks nonbreaking pagebreak restoredraft",
                        content_css: [
                          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                          '//www.tinymce.com/css/codepen.min.css'],


                        menubar: false,
                        toolbar_items_size: 'small',

                        style_formats: [{
                          title: 'Bold text',
                          inline: 'b'
                        }, {
                          title: 'Red text',
                          inline: 'span',
                          styles: {
                            color: '#ff0000'
                          }
                        }, {
                          title: 'Red header',
                          block: 'h1',
                          styles: {
                            color: '#ff0000'
                          }
                        }, {
                          title: 'Example 1',
                          inline: 'span',
                          classes: 'example1'
                        }, {
                          title: 'Example 2',
                          inline: 'span',
                          classes: 'example2'
                        }, {
                          title: 'Table styles'
                        }, {
                          title: 'Table row 1',
                          selector: 'tr',
                          classes: 'tablerow1'
                        }],

                        templates: [{
                          title: 'Test template 1',
                          content: 'Test 1'
                        }, {
                          title: 'Test template 2',
                          content: 'Test 2'
                        }]
                      });*/
                      //$0.onfocus = function(e){e.stopPropagation();e.stopImmediatePropagation()}

                      /*cut copy paste | searchreplace | fullscreen | preview | template | */

                      /***********    TINYMCE SECTION     ************/
                      break;
                      //end if tinymce

                      case "summernote":

                         $('.summernote').summernote();

                      break;

                      case "quill":

                        var options = {
                          debug: 'info',
                          modules: {
                            toolbar: "#" + newObj_label.id
                          },
                          placeholder: 'Compose an epic...',
                          readOnly: true,
                          theme: 'snow'
                        };
                         var editor = new Quill("#" + newObj_quill.id,{theme: 'snow'});


                      break;
                    }//end switch

                }//end if type == texteditor

            }//end else labels

  					this._(key).extractData(this._(key),this._(key).object_elements.newObj_textarea.id,this._(key).type);
          }//end for


  		}//end create_textarea
    }//end if

    if(typeof this.create_select != "function"){
      masterButtons.prototype.create_select = function()
  		{//var create_select
  			/************************************* Sample Code ******************************************
  			window['exTxt'] = new masterButtons({varName:'exTxt',home:'.mIList_ListArea2',type:'text'});
  			exTxt.setLabels(['Title:']);
  			exTxt.setTitles(['Message title']);
  			exTxt.setSelectOptions(['phone','email','name','notification','web address']);
  			exTxt.setDefault('notification');//works
  			exTxt.setPlaceholders(['Enter a Message title']);//can manage for multiple entries
  			exTxt.setPrefix('exTxt');
  			exTxt.setText('Anything');
  			exTxt.setCustomClass(["arc_select"]);
  			exTxt.setInputAttributes({"placeholder":"enter a message title"});//another way to set placeholder - single entry for now
  			exTxt.setInputAttributes({"maxlength":10});
  			exTxt.setInputAttributes({"required":true});
  			exTxt.clearHome("false");
  			exTxt.setCasing();
  			exTxt.display();

  			var event_id = exTxt.get_event_ids();
  			var targetElement = document.getElementById(fyi_event_id[0]);
  			targetElement.oninput = function(){
  			}

  			*********************************************************************************************/

  			 //alert("data object is " + dataObject);
              //gets container
        var vKey = this._(key);
        var input_icon_class = "";
  			var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
  			//clears container
  			if(this._(key).clearHome == "true")
        {
          bigDaddy.innerHTML = "";
        }

  			var add_custom_class = (this._(key).custom_class.length > 1) ? " " + this._(key).custom_class[i] + " " :(this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

          for(var i=0; i < this._(key).labels.length; i++)
          {

            if(this._(key).labels[i] == undefined)
            {
  	//deprecated
                alert("use the setLabels method to set the text for your title or paragraph area.\n use the setTitle method to set the title for your text element.");
            }else
            {
  						if(this._(key).casing != "false"){

  							var newObj_casing = document.createElement('div');
  							newObj_casing.id = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i;
  							newObj_casing.className = this._(key).prefix + "_TCasing" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_TCasing "  + this._(key).prefix + "_TCasing" + i + " TCasing " + add_custom_class;

  						}//end if casing



  						var newObj_label = document.createElement('label');
  						newObj_label.id = this._(key).prefix + "_SLabel" + this._(key).iUN + "_" + i;

  						if(this._(key).has_labels == "true"){

  						newObj_label.className = this._(key).prefix + "_SLabel" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_SLabel "  + this._(key).prefix + "_SLabel" + i + " SLabel ";
  						newObj_label.setAttribute("for",this._(key).prefix + "_TInput" + this._(key).iUN + "_" + i);
  						newObj_label.innerHTML = this._(key).labels[i];
  						newObj_label.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

  						}else{newObj_label.style.display = "none";}


              if(this._(key).input_icon != "false")
              {
                input_icon_class += " input-icon-" + this._(key).icon_dir;

                var newObj_icon_cont = document.createElement('div');
                newObj_icon_cont.id = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i;
                newObj_icon_cont.className = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_ICont "  + this._(key).prefix + "_ICont" + i + " ICont " + add_custom_class + input_icon_class;

                add_custom_class += " blind ";

                if(this._(key).has_alt_callout != "true")
                {
                  //may just need it for show like with a filters magnifying glass - if its just for show do this.
                  input_icon_class += " ui-icon-" + this._(key).input_icon + " ";
                }//end if

              }//end if



  						var newObj_sel_cont = document.createElement('div');
  						newObj_sel_cont.id = this._(key).prefix + "_SCont" + this._(key).iUN + "_" + i;
  						newObj_sel_cont.className = this._(key).prefix + "_SCont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_SCont "  + this._(key).prefix + "_SCont" + i + " SCont ";


              //if(this._(key).object_elements.newObj_input != undefined && this._(key).preserve_entry != false){this._(key).rerun = "true";}

              //this may not need to be changed.  its options are uniquely specific
  							//this._(key).object_elements.newObj_input = (this._(key).object_elements.newObj_input != undefined && this._(key).preserve_entry != false) ? this._(key).object_elements.newObj_input : document.createElement('select');
                this._(key).object_elements.newObj_input = document.createElement('select');
                this._(key).object_elements.newObj_input.id = (this._(key).id_type == "custom") ? this._(key).custom_id :this._(key).prefix + "_SInput" + this._(key).iUN + "_" + i;

  							this._(key).event_ids.push(this._(key).object_elements.newObj_input.id);


  							this._(key).object_elements.newObj_input.className = this._(key).prefix + "_Input" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_CInput "  + this._(key).prefix + "_CInput" + i + " Sel CInput " + add_custom_class;
  							this._(key).object_elements.newObj_input.setAttribute("type","text");

  							if(this._(key).type == "slider")
  							{
  								this._(key).object_elements.newObj_input.setAttribute("data-role","slider")

  							}

  							this._(key).object_elements.newObj_input.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

  							if(this._(key).custom_select != "false"){


  								this._(key).object_elements.newObj_input2 = (this._(key).object_elements.newObj_input2 != undefined && this._(key).preserve_entry != false) ? this._(key).object_elements.newObj_input2 : document.createElement('input');
  								this._(key).object_elements.newObj_input2.id = (this._(key).id_type == "custom") ? this._(key).custom_id : this._(key).prefix + "_CInput" + this._(key).iUN + "_" + i;

  								this._(key).event_ids.push(this._(key).object_elements.newObj_input2.id);
  								this._(key).custom_input_id = this._(key).object_elements.newObj_input.id;
  								this._(key).custom_select_id = this._(key).object_elements.newObj_input2.id;

  								//manage the display
  								this._(key).object_elements.newObj_input.style.display = "block";
  								this._(key).object_elements.newObj_input2.style.display = "none";

  								this._(key).object_elements.newObj_input2.className = this._(key).prefix + "_Input" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_CInput "  + this._(key).prefix + "_CInput" + i + " CInput " + add_custom_class;
  								this._(key).object_elements.newObj_input2.setAttribute("type","text");
                  this._(key).object_elements.newObj_input2.onfocus = ()=>{this._(key).object_elements.newObj_input2.select();}


  							this._(key).object_elements.newObj_input2.title = (this._(key).titles[i] != undefined) ? this._(key).titles[i] : "";

  							}//end if

                if(this._(key).input_icon != "false")
                {
                  //this is for a something like a clear btn "x"  that sits next to the text input
                  var inBtn_icon_class =  " ui-icon-" + this._(key).input_icon + " ";

                  var newObj_input_btn = document.createElement('div');
                  newObj_input_btn.id = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i;
                  newObj_input_btn.className = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_inBtn "  + this._(key).prefix + "_inBtn" + i + " inBtn " + add_custom_class + inBtn_icon_class;

                  newObj_input_btn.addEventListener(this._(key).alt_event,function(e)
                  {
                    if(vKey.has_alt_callout == "true")
                    {
                        var alt_callout_fn = vKey.alt_callout_params[0];
                        alt_callout_fn(e,{"id1":vKey.object_elements.newObj_input.id,"id2":vKey.object_elements.newObj_input2.id},vKey.alt_callout_params[1],vKey.alt_callout_params[2],vKey.alt_callout_params[3],vKey.alt_callout_params[4],vKey.alt_callout_params[5]);

                    }//end if
                  });//end onclick

                }//end if has_alt_callout



  							var newPlace = (this._(key).placeholders[i] != undefined) ? this._(key).placeholders[i] : "";

  							if(newPlace != ""){
  								this._(key).object_elements.newObj_input.setAttribute("placeholder",newPlace);

  								if(this._(key).custom_select != "false"){
  								this._(key).object_elements.newObj_input2.setAttribute("placeholder",newPlace);
  								}
  							}

  							if(this._(key).inner_html != ""){
  								this._(key).object_elements.newObj_input.value = this._(key).inner_html;// && this._(key).rerun != "true"
  							}

  							//helps read setup setInputAttributes json parameters
  							for(var x = 0; x < this._(key).obj_attributes.length; x++)
  							{
  								var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
  								var pName = pNameAry[0];
  								this._(key).object_elements.newObj_input.setAttribute(pName,this._(key).obj_attributes[x][pName]);
  								//console.log(this._(key).object_elements.newObj_input);

  								if(this._(key).custom_select != "false")
  								{
  									this._(key).object_elements.newObj_input2.setAttribute(pName,this._(key).obj_attributes[x][pName]);
  								}//end if

  							}//end for


  							var newObj_sel_tally = document.createElement('div');
  							newObj_sel_tally.id = this._(key).prefix + "_STly" + this._(key).iUN + "_" + i;
  							newObj_sel_tally.className = this._(key).prefix + "_STly" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_STly "  + this._(key).prefix + "_STly" + i + " STly ";
  							newObj_sel_tally.style.display = "none";


  							character_limit = this._(key).object_elements.newObj_input.attributes.maxlength.value || "";

  							this._(key).data_check_array = this._(key).data_check_array.concat({"msg_id":newObj_sel_tally.id,"input_id":this._(key).object_elements.newObj_input.id,"char_limit":character_limit,"type":"text"});

  							var listener_items = (this._(key).type == "select") ? 'input' : 'change';
  							//msg_id input_id char_limit


  								//this._(key).object_elements.newObj_input.oninput = function(){


  								var selectProcess = function(e)
                  {
  									character_limit = vKey.object_elements.newObj_input.attributes.maxlength.value || "";
  									var in_id =  vKey.object_elements.newObj_input.id;
  									var ms_id = newObj_sel_tally.id;
  									newObj_sel_tally.style.display = "none";


  									var theIndex = vKey.object_elements.newObj_input.selectedIndex;
  									var inputValue = vKey.object_elements.newObj_input[theIndex].value;
  									if(inputValue == vKey.custom_select_str)
  									{
  										vKey.object_elements.newObj_input.style.display = "none";
  										vKey.object_elements.newObj_input2.style.display = "block";
  										vKey.object_elements.newObj_input2.focus();
  									}//end if

  									vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":"text"});

  									vKey.extractData(vKey,vKey.object_elements.newObj_input.id,vKey.type);

                    if(vKey.has_callout == "true")
                    {
                        var callout_fn = vKey.callout_params[0];
                        callout_fn(e,vKey.object_elements.newObj_input.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                    }//end if
  								};//end selectProcess

  							if(this._(key).type == "select"){
  								this._(key).object_elements.newObj_input.oninput = function()
  								{
  									selectProcess();

  								}
  							}else{
  								this._(key).object_elements.newObj_input.onchange = function()
  								{
  									selectProcess();
  								}
  							}
  							//to apply additional events externally i had to use jquery
  							////ex. $("#"+accSlide_id).change(function(){});


  							if(this._(key).custom_select != "false"){

  								character_limit = this._(key).object_elements.newObj_input.attributes.maxlength.value || "";

  								//this isn't another dataCheck its an array i can pass to an
  								//external data checker
  								this._(key).data_check_array = this._(key).data_check_array.concat({"msg_id":newObj_sel_tally.id,"input_id":this._(key).object_elements.newObj_input2.id,"char_limit":character_limit,"type":"text"});

  								//msg_id input_id char_limit
  								//this._(key).object_elements.newObj_input2.oninput = function(){



  								var selectProcess2 = function(e){
  									character_limit = vKey.object_elements.newObj_input.attributes.maxlength.value || "";
  									var in_id =  vKey.object_elements.newObj_input2.id;
  									var ms_id = newObj_sel_tally.id;

  									newObj_sel_tally.style.display = "block";


  									vKey.dataCheck(vKey,{"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit,"type":"text"});

  									vKey.extractData(vKey,vKey.object_elements.newObj_input2.id,"text");

                    if(vKey.has_callout == "true")
                    {
                        var callout_fn = vKey.callout_params[0];
                        callout_fn(e,vKey.object_elements.newObj_input2.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                    }//end if
  								};//end selectProcess2

  								this._(key).object_elements.newObj_input2.oninput = function()
  								{
  									selectProcess2();
  								}



  								this._(key).object_elements.newObj_input2.onblur = function()
  									{
  										if(vKey.object_elements.newObj_input2.value == ""){

  											vKey.object_elements.newObj_input.selectedIndex = 0;
  											vKey.object_elements.newObj_input.value = vKey.select_options[0];

  											vKey.object_elements.newObj_input.style.display = "block";
  											vKey.object_elements.newObj_input2.style.display = "none";
  											newObj_sel_tally.style.display = "none";


  											vKey.extractData(vKey,vKey.object_elements.newObj_input.id,"text");
  										}
  									};//end onblur
  							}//end if

  							var options_count = (this._(key).type == "slider") ? 2 : this._(key).select_options.length;//accomodation for sliders
  							var default_index = -1;
  							var input_value = "default";

  							for(var s = 0;s < options_count;s++){

  								var new_option = document.createElement('option');
  								new_option.id = this._(key).prefix + "_SOption" + this._(key).iUN + "_" + s;
  								new_option.className = this._(key).prefix + "_SOption" + this._(key).iUN + "_" + s + " " + this._(key).prefix + "_SOption "  + this._(key).prefix + "_SOption" + s + " SOption ";
  								new_option.innerHTML = this._(key).select_options[s];
  								new_option.value = this._(key).select_options[s];

  								this._(key).object_elements.newObj_input.appendChild(new_option);

  								if(this._(key).default_setting != "" && this._(key).default_setting == this._(key).select_options[s]){
  									this._(key).object_elements.newObj_input.selectedIndex = s;// && this._(key).rerun != "true"
  									default_index = s;
  								}//end if

  								//create the custom option
                  var custom_option_depth = (this._(key).custom_depth != "none") ? this._(key).custom_depth : this._(key).select_options.length - 1;

  								if(this._(key).custom_select != "false" && s == custom_option_depth || this._(key).custom_select != "false" && s == 0 && custom_option_depth == -1)
  								{
  									//console.info("we in here");

  									var custom_option = document.createElement('option');
  									custom_option.id = this._(key).prefix + "_SOption" + this._(key).iUN + "_" + s;
  									custom_option.className = this._(key).prefix + "_SOption" + this._(key).iUN + "_" + s + " " + this._(key).prefix + "_SOption "  + this._(key).prefix + "_SOption" + s + " SOption ";
  									custom_option.innerHTML = this._(key).custom_select_str;
  									custom_option.value = this._(key).custom_select_str;

                    if(this._(key).custom_depth == -1)
                    {
                      this._(key).object_elements.newObj_input.insertBefore(custom_option,new_option);
                    }else
                    {
                      this._(key).object_elements.newObj_input.appendChild(custom_option);
                    }

                    //if the default setting is not found in the select options array put us in custom mode
                    //this is in here so it processes only once
                    //what if it has a custom default but no custom option? - then it shouldn't show, there is no customization
  									if(this._(key).default_setting != "" && default_index == -1){
  										input_value = "custom";//may need custom to process below - yep line 2071
  										this._(key).object_elements.newObj_input.selectedIndex = s;//should be custom
  										//and add the value to the other input
  										this._(key).object_elements.newObj_input2.value = this._(key).default_setting;

  										//put the other input on display
  										this._(key).object_elements.newObj_input.style.display = "none";
  										this._(key).object_elements.newObj_input2.style.display = "block";

  									}

  									//selecting the custom option - li 1400
  									//if(inputValue
  									/*new_option.onclick = function()
  									{
  										//doesn't work - seems no click option
  										this._(key).object_elements.newObj_input.style.display = "none";
  										this._(key).object_elements.newObj_input2.style.display = "block";
  									};*/

  								}//end if custom_select != "false"


  							}//end for

                if(this._(key).input_icon != "false")
                {
                  //put the input into the input icon container
                  newObj_icon_cont.appendChild(this._(key).object_elements.newObj_input);
                  if(this._(key).custom_select != "false"){
                    newObj_icon_cont.appendChild(this._(key).object_elements.newObj_input2);
                  }//end if custom_select

                  //if there is an alt callout manage the button placement
                    if(this._(key).icon_dir == "right")
                    {
                      newObj_icon_cont.appendChild(newObj_input_btn);
                    }else
                    {
                      /*
                      if(this._(key).custom_select != "false"){
                        newObj_icon_cont.insertBefore(newObj_input_btn,this._(key).object_elements.newObj_input2);
                      }//end if custom_select
                      */
                      newObj_icon_cont.insertBefore(newObj_input_btn,this._(key).object_elements.newObj_input);

                    }//end else



                  newObj_sel_cont.appendChild(newObj_icon_cont);

                }else {

        						newObj_sel_cont.appendChild(this._(key).object_elements.newObj_input);
        						if(this._(key).custom_select != "false"){
        							newObj_sel_cont.appendChild(this._(key).object_elements.newObj_input2);
        						}//end if custom_select

                }//end else has_alt_cal


  						newObj_sel_cont.appendChild(newObj_sel_tally);

  						if(this._(key).casing != "false"){
  							newObj_casing.appendChild(newObj_label);
  							newObj_casing.appendChild(newObj_sel_cont);
  							bigDaddy.appendChild(newObj_casing);
  						}else{
  							bigDaddy.appendChild(newObj_label);
  							bigDaddy.appendChild(newObj_sel_cont);
  						}//end if

  						if(this._(key).type == "slider")
  						{
  							var slider_id_str = "#" + this._(key).object_elements.newObj_input.id;
  							$(slider_id_str).slider();
  							$(slider_id_str).slider('refresh');
  						}

        }//end else


  					if(input_value == "custom"){
  						//code to help show custom value in edit mode
  						this._(key).extractData(this._(key),this._(key).object_elements.newObj_input2.id,this._(key).type);
  					}else{
  						this._(key).extractData(this._(key),this._(key).object_elements.newObj_input.id,this._(key).type);
  					}

                  }//end for




  		}//end create_select
    }//end if

    if(typeof this.search_tags_form != "function"){
      masterButtons.prototype.search_tags_form = function()
      {//var search_tags_form
        /********************************  Sample Code  *****************************************
        this._(key).object_elements.tagSYS  = new masterButtons({varName:'tagSYS',home:'contact_form_xtra_mid_cont',type:'tags'});
        this._(key).object_elements.tagSYS.setPrefix('tagSYS');
        this._(key).object_elements.tagSYS.setCustomClass([""]);
        //this._(key).object_elements.tagSYS.setTitles("");// || .setTitles(['Message title']);
        this._(key).object_elements.tagSYS.setLabels("");// || .setLabels(['Title:']);
        this._(key).object_elements.tagSYS.setInputAttributes({"maxlength":otherMaxLength});
        this._(key).object_elements.tagSYS.setInputAttributes({"type":otherTypeAttr});
        //this._(key).object_elements.tagSYS.setText(obj_data.other_data);//sets initial text
        this._(key).object_elements.tagSYS.setPosition("up");
        //setFirst
        //_replace
        //setTags
        this._(key).object_elements.tagSYS.clearHome("false");
        this._(key).object_elements.tagSYS.display();


  			***************************************************************************************/

              //alert("data object is " + dataObject);
              //gets container
          var vKey = this._(key);
          var input_icon_class = "";
          var bigDaddy = (/*stringType == "class"*/document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
                  //clears container
  				if(this._(key).clearHome == "true"){
  					bigDaddy.innerHTML = "";
  				}

  				var add_custom_class = (this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

  				var tagsForm = document.createElement('div');
  				tagsForm.id = this._(key).prefix + "_" + vKey.tgk_str + "Form" + "_" + this._(key).iUN;
  				tagsForm.className = this._(key).prefix + "_" + vKey.tgk_str + "Form" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "Form " + vKey.tgk_str + "Form "  + this._(key).prefix + " " + add_custom_class;

              var tagsTitle = document.createElement('div');
              tagsTitle.id = this._(key).prefix + "_" + vKey.tgk_str + "Title_" + this._(key).iUN;
              tagsTitle.className = this._(key).prefix + "_" + vKey.tgk_str + "Title_" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "Title " + vKey.tgk_str + "Title "  + this._(key).prefix + " " + add_custom_class;
              tagsTitle.innerHTML = (this._(key).titles[0] != undefined) ? this._(key).titles[0] : "";

              this._(key).object_elements.tagsHolder = document.createElement('div');
              this._(key).object_elements.tagsHolder.id = this._(key).prefix + "_" + vKey.tgk_str + "Holder_" + this._(key).iUN;
              this._(key).object_elements.tagsHolder.className = this._(key).prefix + "_" + vKey.tgk_str + "Holder_" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "Holder " + vKey.tgk_str + "Holder "  + this._(key).prefix + " " + add_custom_class;

              /*
              //work out a function to do the work
              if(this._(key).inner_html != ""){
                tagsInput.value = this._(key).inner_html;
              }
              */

              var tags_UI_cont = document.createElement('div');
              tags_UI_cont.id = this._(key).prefix + "_" + vKey.tgk_str + "_UI_cont_" + this._(key).iUN;
              tags_UI_cont.className = this._(key).prefix + "_" + vKey.tgk_str + "_UI_cont_" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "_UI_cont " + vKey.tgk_str + "_UI_cont "  + this._(key).prefix + " " + add_custom_class;


                  var tagsLabel = document.createElement('div');
                  tagsLabel.id = this._(key).prefix + "_" + vKey.tgk_str + "Label_" + this._(key).iUN;
                  tagsLabel.className = this._(key).prefix + "_" + vKey.tgk_str + "Label_" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "Label " + vKey.tgk_str + "Label "  + this._(key).prefix + " " + add_custom_class;
                  tagsLabel.innerHTML = (this._(key).labels[0] != undefined) ? "<p>" + this._(key).labels[0] + "</p>" : "";

                  ///input icon section
                  if(this._(key).input_icon != "false")
                  {
                    input_icon_class += " input-icon-" + this._(key).icon_dir;

                    var tags_icon_cont = document.createElement('div');
                    tags_icon_cont.id = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i;
                    tags_icon_cont.className = this._(key).prefix + "_ICont" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_ICont "  + this._(key).prefix + "_ICont" + i + " ICont " + add_custom_class + input_icon_class;

                    //i may not need this
                    /* //used for an inoperable display icon - i don't think i need this
                    if(this._(key).has_alt_callout != "true")
                    {
                      //may just need it for show like with a filters magnifying glass - if its just for show do this.
                      input_icon_class += " ui-icon-" + this._(key).input_icon + " ";
                    }//end if
                    */

                  }//end if input_icon



                  if(this._(key).object_elements.tagsInput != undefined && this._(key).preserve_entry != false){this._(key).rerun = "true";}
                  this._(key).object_elements.tagsInput = (this._(key).object_elements.tagsInput != undefined && this._(key).preserve_entry != false) ? this._(key).object_elements.tagsInput : document.createElement('input');
                  this._(key).object_elements.tagsInput.id = this._(key).prefix + "_" + vKey.tgk_str + "Input_" + this._(key).iUN;
                  this._(key).object_elements.tagsInput.className = this._(key).prefix + "_" + vKey.tgk_str + "Input_" + this._(key).iUN + " " + this._(key).prefix + "_" + vKey.tgk_str + "Input " + vKey.tgk_str + "Input "  + this._(key).prefix + " " + add_custom_class;
                  this._(key).object_elements.tagsInput.setAttribute("type","text");
                  this._(key).object_elements.tagsInput.onfocus = ()=>{vKey.object_elements.tagsInput.select();}

                  //console.log(this._(key).tags_array);
                  //console.log(this._(key).tag_data_array);

                  //.tagsForm .tagsTitle .tagsHolder .tags_UI_cont .tagsInput .tagsLabel

                  //input btn section
                  if(this._(key).input_icon != "false")
                  {
                    //this is for a something like a clear btn "x"  that sits next to the text input
                    var inBtn_icon_class =  " ui-icon-" + this._(key).input_icon + " ";

                    var tags_input_btn = document.createElement('button');
                    tags_input_btn.id = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i;
                    tags_input_btn.className = this._(key).prefix + "_inBtn" + this._(key).iUN + "_" + i + " " + this._(key).prefix + "_inBtn "  + this._(key).prefix + "_inBtn" + i + " " + vKey.tgk_str + "_inBtn  inBtn " + add_custom_class + inBtn_icon_class + " " +  this._(key).inBtn_btn_class;

                    tags_input_btn.addEventListener("click",function(e)
                    {
                      e.preventDefault();
                      vKey.tagsEnter(vKey);
                    });//end onclick

                  }//end if input_icon

                  /*********************  new section ******************************/
                  //this actually has to be something that collects the data
                  this._(key).event_ids.push(this._(key).object_elements.tagsInput.id);

    							var newPlace = (this._(key).placeholders[i] != undefined) ? this._(key).placeholders[i] : "";

    							//newObj_label.type = () ? "tel" : "";


    							if(newPlace != ""){
    								this._(key).object_elements.tagsInput.setAttribute("placeholder",newPlace);
    							}


    							//helps read setup setInputAttributes json parameters
                  if(this._(key).obj_attributes != undefined && this._(key).obj_attributes[0] != "")
                  {
        							for(var x = 0; x < this._(key).obj_attributes.length; x++)
        							{
        								var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
        								var pName = pNameAry[0];
        								this._(key).object_elements.tagsInput.setAttribute(pName,this._(key).obj_attributes[x][pName]);
        								//console.log(this._(key).object_elements.newObj_input);

        							}//end for
                  }

    							this._(key).object_elements.tagsInput_tally = document.createElement('div');
    							this._(key).object_elements.tagsInput_tally.id = this._(key).prefix + "_" + vKey.tgk_str + "Tly" + this._(key).iUN;
    							this._(key).object_elements.tagsInput_tally.className = this._(key).prefix + "_" + vKey.tgk_str + "Tly" + " " + this._(key).prefix + "_" + vKey.tgk_str + "Tly " + vKey.tgk_str + "Tly "  + this._(key).prefix + "_TTly" + i + " TTly " + add_custom_class;
                  this._(key).object_elements.tagsInput_tally.style.display = "none";//this fixes the tally show bug



                  character_limit = (this._(key).object_elements.tagsInput.attributes.maxlength != undefined) ? this._(key).object_elements.tagsInput.attributes.maxlength.value : 25;

    							//this._(key).data_check_array = this._(key).data_check_array.concat({"msg_id":this._(key).object_elements.newObj_txt_tally.id,"input_id":this._(key).object_elements.newObj_input.id,"char_limit":character_limit,"type":type});

                  this._(key).object_elements.tagsInput.oninput  = function(e)
                  {
                    //console.info("input registers");

                    var in_id =  vKey.object_elements.tagsInput.id;
                    var ms_id = vKey.object_elements.tagsInput_tally.id;

                    if(vKey.object_elements.tagsInput.value == "")
                    {
                      vKey.object_elements.tagsInput_tally.style.display = "none";
                    }else
                    {
                      vKey.object_elements.tagsInput_tally.style.display = "block";
                    }//end else

                    //this puts the newly entered value at the end of the current arrays string
                    var str_val = vKey.tags_array.join("") + vKey.object_elements.tagsInput.value;//why no trailing comma?
                    vKey.dataCheck(vKey,{"msg_id":ms_id,"data_str":str_val,"char_limit":character_limit,"type":vKey.type});//data_str also

                    if(vKey.has_callout == "true")
                    {
                        var callout_fn = vKey.callout_params[0];
                        callout_fn(e,this.id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                    }//end if

                  }//end tagsInput

                  this._(key).object_elements.tagsInput.onkeypress = function(e)
                  {
                    //console.info("input registers");


                    var _key = e.which || e.keyCode;
                    if (e.which == 13 || e.keyCode == 13)
                    {

                        e.preventDefault();
                        //console.info("enter key pressed.")

                        vKey.tagsEnter(vKey);

                        //used so enter press doesn't bubble - i beleieve so it doesn't activiate a submit btn
                        return false;

                    }//end if e.which.

                    return true;

    							};//end this._(key).object_elements.tagsInput.oninput
                  /*********************  new section ******************************/

                  if(this._(key).input_icon != "false")
                  {
                    tags_icon_cont.appendChild(this._(key).object_elements.tagsInput);

                    if(this._(key).icon_dir == "right")
                    {
                      tags_icon_cont.appendChild(tags_input_btn);
                    }else
                    {
                      tags_icon_cont.insertBefore(tags_input_btn,this._(key).object_elements.tagsInput);
                    }//end else

                    tags_UI_cont.appendChild(tagsLabel);
                    tags_UI_cont.appendChild(tags_icon_cont);
                  }else
                  {
                    //preserving the original code. for now..
                    tags_UI_cont.appendChild(tagsLabel);
                    tags_UI_cont.appendChild(this._(key).object_elements.tagsInput);
                  }//end else


              if(this._(key).position_tags_holder != "bottom"){
                tagsForm.appendChild(tagsTitle);
                tagsForm.appendChild(this._(key).object_elements.tagsHolder);
                tagsForm.appendChild(tags_UI_cont);
                tags_UI_cont.appendChild(this._(key).object_elements.tagsInput_tally);

              }else{
                tagsForm.appendChild(tagsTitle);
                tagsForm.appendChild(tags_UI_cont);
                tagsForm.appendChild(this._(key).object_elements.tagsHolder);
                tagsForm.appendChild(this._(key).object_elements.tagsInput_tally);

              }//end else

          bigDaddy.appendChild(tagsForm);

          if(this._(key).rerun == "true" && this._(key).preserve_entry != false && this._(key).tags_array != []){
            //this processes the stored temporary data if the object is not destoyed before its rerun
            var temp_tags = this._(key).tags_array;
            var temp_obj = this._(key).tags_array_object;
            this._(key).tags_array = [];//i cleared tags_array here so it wont concat with itself in the next function
            this._(key).tags_array_object = [];
            this._(key).tagsViewer(this._(key),temp_tags,temp_obj);
          };

      }// end search_tags_form
    }//end if

    this._(key).tagsEnter = function(vKey)
    {//var tagsEnter

      var in_id =  vKey.object_elements.tagsInput.id;
      var ms_id = vKey.object_elements.tagsInput_tally.id;

      //manage the talley display
      if(vKey.object_elements.tagsInput.value == "")
      {
        vKey.object_elements.tagsInput_tally.style.display = "none";
        return;
      }else
      {
        vKey.object_elements.tagsInput_tally.style.display = "block";
      }//end else

      let character_limit = (vKey.object_elements.tagsInput.attributes.maxlength != undefined) ? vKey.object_elements.tagsInput.attributes.maxlength.value : 25;

      var str_val = vKey.tags_array.join("") + vKey.object_elements.tagsInput.value;
      var is_valid = vKey.dataCheck(vKey,{"msg_id":ms_id,"data_str":str_val,"char_limit":character_limit,"type":vKey.type});//data_str also

      //if the data is valid move it to the array, the collector and the holder
      if(is_valid == "valid")
      {
        vKey.tagsViewer(vKey,vKey.object_elements.tagsInput.value);

      }//end if is_valid

    }//end tagsEnter


      this._(key).tagsViewer = function(vKey,data,obj)
      {//var tagsViewer

          var vKey = vKey;

          var bigDaddy = vKey.object_elements.tagsHolder;

          var data_array = (data != undefined && typeof(data) == "object") ? data : [data];
          var data_object = (obj != undefined && typeof(obj) == "object") ? obj : (obj != undefined && obj != "") ? [obj] : [];

          var add_custom_class = (vKey.custom_class.length == 1) ? " " + vKey.custom_class[0] + " " : "";

          for(var d = 0; d < data_array.length; d++){

                //add to the tags_array
                vKey.tags_array = vKey.tags_array.concat(data_array[d]);

                let obj_status = (vKey.type != "tags" && data_object != [] && data_object[d] != undefined) ? "reform" :
                (vKey.type != "tags" && data_object == [] || vKey.type != "tags" && data_object[d] == undefined) ? "create" : "false";

                vKey.tags_array_object = (obj_status == "reform") ? vKey.tags_array_object.concat(data_object[d]) :
                (obj_status == "create") ? vKey.tags_array_object.concat({"text":data_array[d],"check":false}) : vKey.tags_array_object;

                //set a current value
                if(vKey.type == "tags"){
                  vKey.currentValue = (vKey.fixed_value == "false") ? vKey.tags_array.join(",") : vKey.currentValue;
                }else {
                  vKey.currentValue = (vKey.fixed_value == "false") ? JSON.stringify(vKey.tags_array_object) : vKey.currentValue;
                  console.log("current value = " + vKey.currentValue);
                }//end else



                //add element to the view
                var tags_box = document.createElement('div');
                tags_box.id = vKey.prefix + "_" + vKey.tgk_str + "_box_" + vKey.iUN;
                tags_box.className = vKey.prefix + "_" + vKey.tgk_str + "_box_" + vKey.iUN + " " + vKey.prefix + "_" + vKey.tgk_str + "_box " + vKey.tgk_str + "_box "  + vKey.prefix + " " + add_custom_class;
                tags_box.title = data_array[d];

                if(vKey.type == "tasks")
                {
                  var tags_check_cont = document.createElement('div');
                  tags_check_cont.id = vKey.prefix + "_" + vKey.tgk_str + "_check_cont_" + vKey.iUN;
                  tags_check_cont.className = vKey.prefix + "_" + vKey.tgk_str + "_check_cont_" + vKey.iUN + " " + vKey.prefix + "_" + vKey.tgk_str + "_check_cont " + vKey.tgk_str + "_check_cont " + vKey.prefix + " " + add_custom_class;

                  let tC = vKey.tags_count;
                  var tags_check = document.createElement('input');
                  tags_check.id = vKey.prefix + "_" + vKey.tgk_str + "_check_" + vKey.iUN + "_" + tC;
                  tags_check.className = vKey.prefix + "_" + vKey.tgk_str + "_check_" + vKey.iUN + " " + vKey.prefix + "_" + vKey.tgk_str + "_check " + vKey.tgk_str + "_check " + vKey.tgk_str + "_inner "  + vKey.prefix + " " + add_custom_class;
                  tags_check.type = "checkbox";
                  tags_check.dataset.value = data_array[d];
                  //since im concatenating i can use the last entry to get the data being formed
                  tags_check.checked = vKey.tags_array_object[vKey.tags_array_object.length -1].check;

                  tags_check.onclick = function()
                  {
                    var data_index = vKey._checkArray({'array':vKey.tags_array,'string':this.dataset.value});

                    if(data_index != -1){

                      //remove data_index from the array

                        vKey.tags_array_object[data_index].check = this.checked;

                      //update the currentValue

                        vKey.currentValue = (vKey.fixed_value == "false") ? JSON.stringify(vKey.tags_array_object) : vKey.currentValue;
                        console.log("check current value = " + vKey.currentValue);
                    }//end if data_index

                  }//end tags_check

                  tags_check_cont.appendChild(tags_check);
                  vKey.tags_count++;

                }//end if

                var tags_text = document.createElement('div');
                tags_text.id = vKey.prefix + "_" + vKey.tgk_str + "_text_" + vKey.iUN;
                tags_text.className = vKey.prefix + "_" + vKey.tgk_str + "_text_" + vKey.iUN + " " + vKey.prefix + "_" + vKey.tgk_str + "_text " + vKey.tgk_str + "_text " + vKey.tgk_str + "_inner "  + vKey.prefix + " " + add_custom_class;
                tags_text.innerHTML = "<p>" + data_array[d] + "</p>";

                var tags_close = document.createElement('div');
                tags_close.id = vKey.prefix + "_" + vKey.tgk_str + "_close_" + vKey.iUN;
                tags_close.className = vKey.prefix + "_" + vKey.tgk_str + "_close_" + vKey.iUN + " " + vKey.prefix + "_" + vKey.tgk_str + "_close " + vKey.tgk_str + "_close " + vKey.tgk_str + "_inner "  + vKey.prefix + " " + add_custom_class
                + "d3-ui ui-icon-nope"
                tags_close.dataset.value = data_array[d];
                tags_close.onclick = function()
                {

                  var data_index = vKey._checkArray({'array':vKey.tags_array,'string':this.dataset.value});

                  if(data_index != -1){
                    //delete the parent node
                    var my_parent = this.parentNode;
                    var grand_parent = my_parent.parentNode;
                    grand_parent.removeChild(my_parent);

                    //remove data_index from the array
                    if(vKey.type == "tags")
                    {
                      vKey.tags_array.splice(data_index,1);
                    }else
                    {
                      vKey.tags_array.splice(data_index,1);
                      vKey.tags_array_object.splice(data_index,1);
                    }//end else

                    //update the currentValue
                    if(vKey.type == "tags"){
                      vKey.currentValue = (vKey.fixed_value == "false") ? vKey.tags_array.join(",") : vKey.currentValue;
                    }else {
                      vKey.currentValue = (vKey.fixed_value == "false") ? JSON.stringify(vKey.tags_array_object) : vKey.currentValue;
                      console.log("close current value = " + vKey.currentValue);
                    }//end else
                    //reevaluate the tally  var in_id =  vKey.object_elements.tagsInput.id;
                      var ms_id = vKey.object_elements.tagsInput_tally.id;

                      if(vKey.object_elements.tagsInput.value == "")
                      {
                        vKey.object_elements.tagsInput_tally.style.display = "none";
                      }else
                      {
                        vKey.object_elements.tagsInput_tally.style.display = "block";
                      }//end else

                      var str_val = vKey.tags_array.join("") + data_array[d];
                      vKey.dataCheck(vKey,{"msg_id":ms_id,"data_str":str_val,"char_limit":character_limit,"type":vKey.type});//data_str also


                  }else{
                    //console.error("there is an issue with the vKey.tags_array");
                    throw error;
                  }// end else

                }//end tags_close onclick

                //clear the value
                vKey.object_elements.tagsInput.value = "";

                //vKey.extractData(vKey,vKey.object_elements.tagsInput.id,vKey.type);
                //code to execute here
                if(vKey.type == "tasks"){tags_box.appendChild(tags_check_cont);}
                tags_box.appendChild(tags_text);
                tags_box.appendChild(tags_close);
                bigDaddy.appendChild(tags_box);

                if(vKey.type == "tasks")
                {
                  let tags_id_str = "#" + tags_check.id;
                  $(tags_id_str).checkboxradio();//".tasks_check" works too
                }

            }//end for

        }//end tagsViewer

      if(typeof this.filterDisplay != "function"){
        masterButtons.prototype.filterDisplay = function()
        {//var filterDisplay

          /********************************  Sample Code  *****************************************

          				var filter_str = 'd3_filter' + d;
          				this._(key).object_elements[filter_str]  = new masterButtons({varName:filter_str,home:ul_id,type:'filter'});//display_home
          				this._(key).object_elements[filter_str].setPrefix(filter_str);
          				this._(key).object_elements[filter_str].setCustomClass([""]);
          				this._(key).object_elements[filter_str].setLabels("type phrase then press enter:");
          				//this._(key).object_elements[filter_str].setFilterMode({mode:'replace',_target:'ui-input-search'});
          				this._(key).object_elements[filter_str].setFilterMode({mode:'jqm'});//,this._(key).need_search_string:"false"
          				//this._(key).object_elements[filter_str].setTitles("tag maker:");
          				this._(key).object_elements[filter_str].setInputAttributes({"placeholder":"filter by title, date, tag..."});//another way to set placeholder - single entry for now
          				this._(key).object_elements[filter_str].clearHome("false");
          				this._(key).object_elements[filter_str].display();

          				var tags_id_ary = this._(key).object_elements[filter_str].get_event_ids();
          				var targetElement = document.getElementById(tags_id_ary[0]);


          ***************************************************************************************/

            //alert("data object is " + dataObject);
            //gets container

            var bigDaddy = (document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
            //clears container
            var vKey = this._(key);

            /*
            if(this._(key).clearHome == "true"){
              bigDaddy.innerHTML = "";
            }
            */
            //does it already have child nodes? - should be yes
            var bigDaddy_child_nodes = bigDaddy.hasChildNodes();

            var add_custom_class = (this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

            this._(key).object_elements.filter_cont = document.createElement("div");
            this._(key).object_elements.filter_cont.id = this._(key).prefix + "_filter_cont" + "_" + i;
            this._(key).object_elements.filter_cont.className = this._(key).prefix + "_filter_cont" + this._(key).iUN  + " " + this._(key).prefix + "_filter_cont filter_cont " + add_custom_class;
            this._(key).object_elements.filter_cont.onclick = ()=>{this._(key).object_elements.filter_input.focus();}

            //if(this._(key).fill_content != ""){newTag.innerHTML = this._(key).fill_content;}
            this._(key).object_elements.filter_input = document.createElement("input");
            this._(key).object_elements.filter_input.id = this._(key).prefix + "_filter_input" + "_" + i;
            this._(key).object_elements.filter_input.className = this._(key).prefix + "_filter_input" + this._(key).iUN  + " " + this._(key).prefix + "_filter_input filter_input " + add_custom_class;
            this._(key).object_elements.filter_input.onfocus = function(vKey){var targ_par = this.parentElement;$(targ_par).addClass('focus');this.select();/*vKey.object_elements.filter_input*/}
            this._(key).object_elements.filter_input.onblur = function(vKey){var targ_par = this.parentElement;$(targ_par).removeClass('focus');}


            this._(key).object_elements.filter_input.oninput = function()
            {
              //var vKey = vKey;
              //console.log("input event triggered");
              vKey.hide_n_seek(vKey,bigDaddy,this);

            }//end on input

            /*
              //I can use this to trigger an event:

              var evt = new Event('input');
              $0.dispatchEvent(evt);
              $0.value += "vxc";

              http://javascriptexample.net/events14.php
              http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
              http://caniuse.com/#search=Event

              //i was avoiding this:
              http://api.jquery.com/trigger/
            */

            this._(key).event_ids.push(this._(key).object_elements.filter_input.id);

            for(var x = 0; x < this._(key).obj_attributes.length; x++)
            {
              var pNameAry = Object.getOwnPropertyNames(this._(key).obj_attributes[x]);
              var pName = pNameAry[0];
              this._(key).object_elements.filter_input.setAttribute(pName,this._(key).obj_attributes[x][pName]);
              //console.log(newObj);

            }//end for

            this._(key).object_elements.filter_cont.appendChild(this._(key).object_elements.filter_input);

            if(bigDaddy_child_nodes === true)
            {
                switch(this._(key).filter_mode)
                {
                  ///replace and add haven't been tested or developed - im sure  they will error out

                  case "replace":
                  //add or replace

                  //get the replacement target
                  var repTarg = (bigDaddy.getElementById(this._(key).filter_target)) ? bigDaddy.getElementById(this._(key).filter_target) : bigDaddy.getElementsByClassName(this._(key).filter_target)[0];
                  bigDaddy.replaceChild(this._(key).object_elements.filter_cont,repTarg);

                  //this will be near the end
                  break;

                case "add":
                  //insert before bigDaddy - not a child of the container
                  //i need to test this out.  in theory it should work, but ...
                  var before_target = (this._(key).filter_target != "") ? ((bigDaddy.getElementById(this._(key).filter_target)) ? bigDaddy.getElementById(this._(key).filter_target) : bigDaddy.getElementsByClassName(this._(key).filter_target)[0]) : bigDaddy.firstChild;
                  bigDaddy.insertBefore(this._(key).object_elements.filter_cont,before_target);

                break;

                case "jqm":

                //get the cousin
                var bigUncle = bigDaddy.previousSibling;
                var cousin_it = bigUncle.childNodes[0];

                bigUncle.replaceChild(this._(key).object_elements.filter_cont,cousin_it);


                break;
              }//end switch

            }else if(bigDaddy_child_nodes != true && this._(key).filter_mode == "jqm")
            {
              //get the cousin
              var bigUncle = bigDaddy.previousSibling;
              var cousin_it = bigUncle.childNodes[0];

              bigUncle.replaceChild(this._(key).object_elements.filter_cont,cousin_it);

            }
            else
            {
              //i put this in so it doesn't break if its empty
              bigDaddy.appendChild(this._(key).object_elements.filter_cont);
            }//end else bigDaddy_child_nodes


            //bigDaddy.appendChild(filter_input);

            if(this._(key).need_search_string == "true"){
              this.prep_filter_elements(bigDaddy);
            }//end if

        }//end filterDisplay
      }//end if


      if(typeof this.hide_n_seek != "function"){
        masterButtons.prototype.hide_n_seek = function(elem,inp)
        {
          this._(key).hide_n_seek(this._(key),elem,inp);
        }//end prototype

      }//end if hide_n_seek

      this._(key).hide_n_seek = function(vKey,elem,inp)
      {
          //var hide_n_seek
          //get the target container
          //var targ_el = bigDaddy;
          var vKey = vKey;
          var targ_el = elem;

          //check to see if there are child nodes
          var has_child_nodes = targ_el.hasChildNodes();

          //if so loop through each
          if(has_child_nodes == true)
          {

            //create a loop for the parent childnodes
            for(let i = 0; i < targ_el.childNodes.length; i++)
            {
              //get the target childNode
              var nxt_targ = targ_el.childNodes[i];
              var view_status = "show";

              //turn the search_string into an array separated by spaces
              var search_string_array = nxt_targ.dataset.search_string.split(",");

              //turn the input data into an array separated by spaces
              //var input_string_array = this.value.split(" ");inp
              var my_value = inp.value;

              //make it all lowercase
              my_value = my_value.toLowerCase();

              var input_string_array = my_value.split(" ");

              //check to see if each array index is found in the search_string array
              for(let x = 0; x < input_string_array.length; x++)
              {
                  //run a function that adds to this string new words while avoiding duplicate words.
                  let is_in_array = vKey.valueChecker({"array":search_string_array,"string":input_string_array[x],"mod":"index","type":"sna","action":"compare"});
                  //console.log("is_in_array",is_in_array);

                  //if something comes up missing (== -1) remove the childnodes display

                  if(is_in_array[0] == -1)
                  {
                    view_status = "hide";
                  }//end if is_in_array

                  if( view_status == "hide")
                  {
                    targ_el.childNodes[i].style.display = "none";
                  }else
                  {
                    //otherwise if something is present show the display
                    targ_el.childNodes[i].style.display = "block";
                  }

              }//end for let x

            }//end for let i

          }//end if


        }//end hide_n_seek



      if(typeof this.parse_node_text != "function"){
        masterButtons.prototype.parse_node_text = function(parent_cont,elem)
        {//var parse_node_text - this calls itself it may need to stay a var

          //get target container
          var targ_el = elem;

          //count its childNodes
          var has_child_nodes = targ_el.hasChildNodes();

          //passing the target element twice triggers the data-search_string init
          if(parent_cont != undefined && parent_cont != "" && parent_cont === elem){parent_cont.dataset.search_string = "";}

          //create a string for the childnodes eventual innerText (kind of does this - updated method)
          var search_str = parent_cont.dataset.search_string;

          var targ_text = (targ_el.innerText != undefined && targ_el.innerText != "") ? targ_el.innerText : "";

          //the targ_text was a problem = it sometimes matched the jumbled textContent
          //the innerHTLM as pure text is a good way to indicate when we have arrived at the true innerText
          if(targ_el.innerText != targ_el.innerHTML){targ_text = "";}

          if(has_child_nodes == true)
          {

            //create a loop for the parent childnodes
            for(var i = 0; i < targ_el.childNodes.length; i++)
            {
              var nxt_targ = targ_el.childNodes[i];
              this.parse_node_text(parent_cont,nxt_targ);//return value no longer needed

            }//end for

          }//end if

          if(targ_text != "")
          {
            //userful while statements
            //split its text and see if it is already in the stringType
            while(targ_text.indexOf("  ") != -1)
            {
              //removes extra spaces
              targ_text = targ_text.replace("  "," ");
            }//end while

            while(targ_text.indexOf(" ") != -1)
            {
              //removes single spaces
              targ_text = targ_text.replace(" ",",");
            }//end while

            var my_txt_ary = targ_text.split(",");

            if(search_str != "")
            {
              var par_search_array = search_str.split(",");

              for(var x = 0; x < my_txt_ary.length; x++)
              {
                  //run a function that adds to this string new words while avoiding duplicate words.
                  var is_in_array = this._(key).valueChecker({"array":par_search_array,"string":my_txt_ary[x],"mod":"index","type":"sna","action":"match"});
                  //console.log("is_in_array",is_in_array);

                  if(is_in_array[0] == -1)
                  {
                    //after all the child elements of this childnode have been examined add this string to something
                    //that is associated with this childnodes index.
                    par_search_array = par_search_array.concat(my_txt_ary[x]);
                  }

              }//end for
              //after all the child elements of this childnode have been examined add this string to something
              //that is associated with this childnodes index.
              parent_cont.dataset.search_string = par_search_array.join(",");;

            }else
            {
              //after all the child elements of this childnode have been examined add this string to something
              //that is associated with this childnodes index.
              parent_cont.dataset.search_string = my_txt_ary.join(",");

            }//end else node_text_str

            //cleanup time
            while(parent_cont.dataset.search_string.indexOf(",,") != -1)
            {
              //removes extra spaces
              parent_cont.dataset.search_string = parent_cont.dataset.search_string.replace(",,",",");
              parent_cont.dataset.search_string = parent_cont.dataset.search_string.toLowerCase();
            }//end while


          }//end if targ_text

        }//end parse_node_text
      }//end if

      if(typeof this.prep_filter_elements != "function"){
        masterButtons.prototype.prep_filter_elements = function(hm_el)
        {//var prep_filter_elements
          var home_element = hm_el;
          var _has_children = home_element.hasChildNodes();

          if(_has_children == true)
          {
              for(var b = 0; b < home_element.childNodes.length; b++)
              {
                  this.parse_node_text(home_element.childNodes[b],home_element.childNodes[b]);

              }//end for

          }//end if


        }//end prep_filter_elements
      }//end if


      if(typeof this.create_light_box != "function"){
        masterButtons.prototype.create_light_box = function()
    		{//var create_light_box
          /********************************  Sample Code  *****************************************
          //update sample code 8/2017
          var liteBox  = new masterButtons({varName:'liteBox',home:"arc_hidden_cont",type:'lightbox'});//display_home
  				liteBox.setPrefix('liteBox');
  				liteBox.setCustomClass(["arc_list_preview"]);
  				//liteBox.setCloseBtn("false");
  				//liteBox.setSinglePage();
  				liteBox.setLabels(["favorites","recent","search"]);
  				liteBox.setIcons(["bookmark","star","search"]);
          //liteBox.unsetModal();
          //liteBox.setGoCallout();
          //liteBox.setCallout();//triggered by page buttons
  				liteBox.view_ctrl_row();//view ctrls in a row not a single toggle button(default)
  				liteBox.setGoBtn("false");
  				liteBox.setCancelBtn("false");
  				liteBox.clearHome("false");
  				liteBox.display();

  				var rF_id_ary = liteBox.get_event_ids();

  				var front_view = rF_id_ary[0];




          ***************************************************************************************/



    			//NOTE use object elements data_store & temp_store to pass lightbox/lightbox elements
    			//this._(key).object_elements["data_store"]
    			//this._(key).object_elements["temp_store"]
    			//don't forget to pass the create_light_box function a trans object
          var vKey = this._(key);
          var bigDaddy = (document.getElementById(this._(key).home)) ? document.getElementById(this._(key).home) : document.getElementsByClassName(this._(key).home)[0];
          //clears container

          this._(key).single_page = (this._(key).labels.length < 1) ? "true" : "false";

          if(this._(key).clearHome == "true")
          {
            bigDaddy.innerHTML = "";
          }

    						//if(!document.getElementsByClassName("lightbox")[0])


                  var add_custom_class = (this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

                  if(this._(key).modal != "false")
                  {
                    //this removes the light box styled transparent overlay that surrounds the content area

            				this._(key).object_elements.lightbox = document.createElement('div');
            				this._(key).object_elements.lightbox.id = this._(key).prefix + "_lightbox_" + this._(key).iUN;
                    this._(key).object_elements.lightbox.className = this._(key).prefix + "_lightbox_" + this._(key).iUN + " " + this._(key).prefix + "_lightbox " + " lightbox popup" + add_custom_class;

                  }//end if modal
          				//this._(key).event_ids.push(newTag.id);

                      this._(key).object_elements.glassHouse = document.createElement('div');
                      this._(key).object_elements.glassHouse.id = this._(key).prefix + "_glassHouse_" + this._(key).iUN;
                      this._(key).object_elements.glassHouse.className = this._(key).prefix + "_glassHouse_" + this._(key).iUN + " " + this._(key).prefix + "_glassHouse " + " glassHouse " + add_custom_class;

                      if(this._(key).close_btn == "true")
                      {
                          this._(key).object_elements.looking_glass = document.createElement('button');
                          this._(key).object_elements.looking_glass.id = this._(key).prefix + "_looking_glass_" + this._(key).iUN;
                          this._(key).object_elements.looking_glass.className = this._(key).prefix + "_looking_glass_" + this._(key).iUN + " " + this._(key).prefix + "_looking_glass " + " looking_glass "
                          + " ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right " + add_custom_class;
                          this._(key).object_elements.looking_glass.title = "cancel";
                          this._(key).object_elements.looking_glass.innerHTML = "<h4>Cancel</h4>";

                          this._(key).object_elements.looking_glass.onclick = function(e)
            							{
            								e.preventDefault();
            								bigDaddy.innerHTML = "";

            							}//end glassCancelElement.onclick

                      }//end if top_close


                        if(this._(key).glass_ctrls_view != "toggle")
                        {
                          //front icon here
                          var lbx_btn_mkr = function(bxObj)
                          {
                            let g_btn_str = bxObj.id;
                            let g_bTx = bxObj.text || "alt";
                            let a = bxObj.nbr || 0;
                            let g_bIcon = bxObj.icon || "";
                            let g_bTitle = bxObj.title || "";
                            let g_bClass = bxObj.class || "";

                            vKey.object_elements[g_btn_str] = document.createElement('button');
                            vKey.object_elements[g_btn_str].id = vKey.prefix + "_" + g_bTx + "_glass_btn_"  + a + "_" + vKey.iUN;
                            vKey.object_elements[g_btn_str].className = vKey.prefix + "_" + g_bTx + "_glass_btn_" + a + "_" + vKey.iUN + " " + vKey.prefix + "_" + g_bTx + "_glass_btn_" + a
                            + " " + vKey.prefix + "_" + g_bTx + "_glass_btn " + " alt_glass glass_ctrls lbx_ctrl_row "
                            + " ui-btn ui-shadow ui-btn-a ui-icon-" + g_bIcon + " ui-btn-icon-notext ui-btn-right " + add_custom_class;
                            vKey.object_elements[g_btn_str].title = g_bTitle;//ui-corner-all
                            vKey.object_elements[g_btn_str].innerHTML = "<h4>" + g_bTitle + "</h4>";
                            vKey.object_elements[g_btn_str].dataset.nbr = a;

                            vKey.object_elements[g_btn_str].onclick = function(e)
                            {
                              let targ_nbr = this.dataset.nbr;
                              let page_str = "glass_page_" + a;
                              let targ_el = vKey.object_elements[page_str];
                              let targ_id = targ_el.id;
                              let jQ_id_str = "#" + targ_id;

                              $(".glass_page").removeClass("lbx_page_show");
                              $(".glass_page").addClass("lbx_page_hide");

                              $(jQ_id_str).removeClass("lbx_page_hide");
                              $(jQ_id_str).addClass("lbx_page_show");

                              //update the title
                              vKey.object_elements.glass_title.innerHTML = "<h5>" + this.title + "</h5>";
                              e.preventDefault();
                              if(vKey.has_callout == "true")
                              {
                                  let callout_fn = vKey.callout_params[0];
                                  callout_fn(e,targ_id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                              }//end if

                            }//end alt_page.onclick

                          }
                          //alt page icons

                          for(let a = 0; a < this._(key).labels.length; a++)
                          {


                            let alt_glass_str = "alt_glass_btn_" + a;
                            let alt_title = vKey.labels[a];
                            let alt_icon = (this._(key).icons.length > 1) ? this._(key).icons[a] : (this._(key).icons.length == 1) ? this._(key).icons[0] : "";
                            let alt_class = (this._(key).custom_class.length > 1) ? " " + this._(key).custom_class[a] + " " :(this._(key).custom_class.length == 1) ? " " + this._(key).custom_class[0] + " " : "";

                            //dont forget i wrote this function when there was a front and rear page - i left it
                            //here to save from doing anymore work on this.
                            lbx_btn_mkr({"id":alt_glass_str,"text":"alt","nbr":a,"class":alt_class,"title":alt_title,"icon":alt_icon});

                          }//end for

                        }//end if glass_ctrls_view



                        if(this._(key).single_page != "true" && this._(key).glass_ctrls_view == "toggle")
                        {
                          //toggle section - one button for everything
                          let tog_glass_str = "tog_glass";
                          //let me_seeks =  this._(key).icons[0];
                          let tog_icon_nm =  this._(key).icons[0] || "none";

                          this._(key).object_elements[tog_glass_str] = document.createElement('button');
                          this._(key).object_elements[tog_glass_str].id = this._(key).prefix + "_tog_glass_" + this._(key).iUN;
                          this._(key).object_elements[tog_glass_str].className = this._(key).prefix + "_tog_glass_" + this._(key).iUN + " " + this._(key).prefix + "_tog_glass "
                          + this._(key).prefix + "_tog_glass " + " tog_glass glass_ctrls "
                          + " ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-" + tog_icon_nm + " ui-btn-icon-notext ui-btn-right " + add_custom_class;
                          this._(key).object_elements[tog_glass_str].title = "next";
                          this._(key).object_elements[tog_glass_str].innerHTML = "<h5>next</h5>";

                          this._(key).object_elements[tog_glass_str].onclick = function()
                          {
                            var e = event || window.event;
                            e.preventDefault();

                            //use this to toggle the ids this._(key).event_ids
                            //get the visible page
                            var visible_page = $(".lbx_page_show")[0];
                            var nxt_icon_cls = "ui-icon-" + vKey.icons[0] || "ui-icon-" + "none";

                            var front_icon_cls = (vKey.icons.length > 1) ? "ui-icon-" + vKey.icons[1] : (vKey.icons.length == 1) ? "ui-icon-" + vKey.icons[0] : "ui-icon-" + "none";


                            $(".glass_page").removeClass("lbx_page_show");
                            $(".glass_page").addClass("lbx_page_hide");

                            var current_index = vKey._checkArray({'string':visible_page.id,'array':vKey.event_ids});

                            var switch_index = current_index;

                            if(current_index < vKey.event_ids.length - 1)
                            {
                              //switch to nxt_icon
                              switch_index = current_index + 1;
                            }else{
                              switch_index = 0;
                            }

                            let targ_id = vKey.event_ids[switch_index];
                            let targ_el = document.getElementById(targ_id);
                            let id_str = "#" + targ_id;
                            $(id_str).removeClass("lbx_page_hide");
                            $(id_str).addClass("lbx_page_show");

                            vKey.object_elements.glass_title.innerHTML = "<h5>" + targ_el.dataset.title + "</h5>";

                            e.preventDefault();
                            if(vKey.has_callout == "true")
                            {
                                let callout_fn = vKey.callout_params[0];
                                callout_fn(e,targ_id,vKey.callout_params[1],vKey.callout_params[2],vKey.callout_params[3],vKey.callout_params[4],vKey.callout_params[5]);

                            }//end if

                            //change the tog_glass btn icon
                            if(switch_index == vKey.event_ids.length - 1)
                            {
                              //switch to main_icon
                              $(".tog_glass").removeClass(nxt_icon_cls);
                              $(".tog_glass").addClass(front_icon_cls);

                            }else {
                              //switch to nxt_icon
                              $(".tog_glass").removeClass(front_icon_cls);
                              $(".tog_glass").addClass(nxt_icon_cls);
                            }



                          }//end tog_glass.onclick


                      }//end if !single_page

                          this._(key).object_elements.glass_title = document.createElement('div');
                          this._(key).object_elements.glass_title.id = this._(key).prefix + "_glass_title_" + this._(key).iUN;
                          this._(key).object_elements.glass_title.className = this._(key).prefix + "_glass_title_" + this._(key).iUN + " "
                          + this._(key).prefix + "_glass_title " + " glass_title " + add_custom_class;
                          this._(key).object_elements.glass_title.innerHTML = "<h5>" + this._(key).labels[0] + "</h5>";

                          let head_view_cls = (this._(key).glass_ctrls_view != "toggle") ? " lbox_row " : "";//used to set min-height in css

                          this._(key).object_elements.glass_header = document.createElement('div');
                          this._(key).object_elements.glass_header.id = this._(key).prefix + "_glass_header_" + this._(key).iUN;
                          this._(key).object_elements.glass_header.className = this._(key).prefix + "_glass_header_" + this._(key).iUN + " "
                          + this._(key).prefix + "_glass_header " + " glass_header " + head_view_cls + add_custom_class;




                          this._(key).object_elements.glass_content = document.createElement('div');
                          this._(key).object_elements.glass_content.id = this._(key).prefix + "_glass_content_" + this._(key).iUN;
                          this._(key).object_elements.glass_content.className = this._(key).prefix + "_glass_content_" + this._(key).iUN + " " + this._(key).prefix + "_glass_content " + " glass_content " + add_custom_class;


                              for(let a = 0; a < this._(key).labels.length; a++)
                              {
                                  let glass_page_str = "glass_page_" + a;
                                  let hide_str = (a == 0) ? "lbx_page_show": "lbx_page_hide";

                                  this._(key).object_elements[glass_page_str] = document.createElement('div');
                                  this._(key).object_elements[glass_page_str].id = this._(key).prefix + "_glass_page_" + a + "_" + this._(key).iUN;
                                  this._(key).object_elements[glass_page_str].className = this._(key).prefix + "_glass_page_" + a + "_" + this._(key).iUN + " " + this._(key).prefix + "_glass_page_" + a + " "
                                  + this._(key).prefix + "page "+ this._(key).prefix + "_glass_page " + " glass_page " + hide_str + " glass_page " + add_custom_class;
                                  this._(key).object_elements[glass_page_str].style.display = "block";
                                  this._(key).object_elements[glass_page_str].dataset.title = this._(key).labels[a];

                                  this._(key).event_ids.push(this._(key).object_elements[glass_page_str].id);

                              this._(key).object_elements.glass_content.appendChild(this._(key).object_elements[glass_page_str]);
                              }



                          this._(key).object_elements.glass_controls = document.createElement('div');
                          this._(key).object_elements.glass_controls.id = this._(key).prefix + "_glass_controls_" + this._(key).iUN;
                          this._(key).object_elements.glass_controls.className = this._(key).prefix + "_glass_controls_" + this._(key).iUN + " " + this._(key).prefix + "_glass_controls " + " glass_controls " + add_custom_class;

                          if(this._(key).go_btn == "true")
                          {
                              this._(key).object_elements.glass_confirm = document.createElement('button');
                              this._(key).object_elements.glass_confirm.id = this._(key).prefix + "_glass_confirm_" + this._(key).iUN;
                              this._(key).object_elements.glass_confirm.className = this._(key).prefix + "_glass_confirm_" + this._(key).iUN + " " + this._(key).prefix + "_glass_confirm glass_confirm "
                              + " ui-btn ui-icon-check ui-btn-icon-left ui-btn-icon-notext" + add_custom_class;
                              this._(key).object_elements.glass_confirm.setAttribute("title","submit");
                              this._(key).object_elements.glass_confirm.innerHTML = "<h4>OK</h4>";

                              this._(key).object_elements.glass_confirm.onclick = function(e)
                							{

                								e.preventDefault();
                                if(vKey.has_go_callout == "true")
                                {
                                    var go_callout_fn = vKey.go_callout_params[0];
                                    go_callout_fn(e,this.id,vKey.go_callout_params[1],vKey.go_callout_params[2],vKey.go_callout_params[3],vKey.go_callout_params[4],vKey.go_callout_params[5]);

                                }//end if

                								//vKey.object_elements["data_store"] = vKey.object_elements["temp_store"];
                								//vKey.object_elements["temp_store"] = {};
                								bigDaddy.innerHTML = "";


                							}//end this._(key).object_elements.glass_confirm.onclick
                            }//end if go_btn

                            if(this._(key).can_btn == "true")
                            {
                              this._(key).object_elements.glass_cancel = document.createElement('button');
                              this._(key).object_elements.glass_cancel.id = this._(key).prefix + "_glass_cancel_" + this._(key).iUN;
                              this._(key).object_elements.glass_cancel.className = this._(key).prefix + "_glass_cancel_" + this._(key).iUN + " " + this._(key).prefix + "_glass_cancel glass_cancel "
                              + " ui-btn ui-icon-delete ui-btn-icon-left ui-btn-icon-notext " + add_custom_class;
                              this._(key).object_elements.glass_cancel.setAttribute("title","cancel");
                              this._(key).object_elements.glass_cancel.innerHTML = "<h4>Cancel</h4>";


                							this._(key).object_elements.glass_cancel.onclick = function(e)
                							{
                								e.preventDefault();
                								vKey.object_elements["temp_store"] = {};

                                if(vKey.has_can_callout == "true")
                                {
                                    var can_callout_fn = vKey.can_callout_params[0];
                                    can_callout_fn(e,this.id,vKey.can_callout_params[1],vKey.can_callout_params[2],vKey.can_callout_params[3],vKey.can_callout_params[4],vKey.can_callout_params[5]);

                                }//end if

                                bigDaddy.innerHTML = "";

                							}//end glassCancelElement.onclick
                            }//end if can_btn

                      if(this._(key).go_btn == "true"){  this._(key).object_elements.glass_controls.appendChild(this._(key).object_elements.glass_confirm);}

                      if(this._(key).can_btn == "true"){ this._(key).object_elements.glass_controls.appendChild(this._(key).object_elements.glass_cancel);}

                      if(this._(key).close_btn == "true"){
                        this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements.looking_glass);
                      }//end if close_btn


                      if(this._(key).glass_ctrls_view != "toggle")
                      {

                        //set alt btns
                        for(let x = 0; x < this._(key).labels.length; x++)
                        {
                          let alt_glass_str = "alt_glass_btn_" + x;
                          this._(key).object_elements.glass_header.appendChild(this._(key).object_elements[alt_glass_str]);
                        }//end for

                      }else
                      {
                        this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements["tog_glass"]);
                      }//end else alt_page


                      this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements.glass_title);
                      this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements.glass_header);
                      this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements.glass_content);
                      this._(key).object_elements.glassHouse.appendChild(this._(key).object_elements.glass_controls);

                      if(this._(key).modal != "false")
                      {
                        this._(key).object_elements.lightbox.appendChild(this._(key).object_elements.glassHouse);
                        bigDaddy.appendChild(this._(key).object_elements.lightbox);
                      }else{
                        bigDaddy.appendChild(this._(key).object_elements.glassHouse);
                      }//else if modal


    		}//end create_light_box
      }//end if


      this._(key).valueChecker = function(sObj)
  		{//var valueChecker - this one stays
  			/*
  			if found returns an array of string or index values

  			example use:
  			var isString =  this._(key).valueChecker({"array":icon_keys,"string":target_string,"mod":"string","type":"ans"});
  			if(isString[0] == -1)

  			ans = array in string - (was checkStringForArray2) checkStringForArray2
  			sna = string in array - (was check array for string)
  			*/

  			var testString = sObj.string;
  			var testArray = sObj.array;
  			var modifier = sObj.mod || "index";//other value is name
  			var type = sObj.type || "ans";
  			var strIndx = [];
  			var action = (sObj.action != undefined && sObj.action == "match") ? "match" : "compare";


  			strIndx[0] = (modifier == "index") ? -1 : "none";

  			for(var i = 0; i < testArray.length; i++)
  			{
  				var targetString = (type == "ans") ? testString : testArray[i];//
  				var testValue = (type == "ans") ? testArray[i] : testString;
  				var is_present = "false";

  				//does the string - (usually long) have any of the array values
  				//"https://youtube.com/#*(&$)*&*(*)whatever".indexof("youtube")

  				if(action == "compare")
  				{
  					if(targetString.indexOf(testValue) != -1)
  					{
  						var is_present = "true";
  					}
  				}else
  				{
  					if(targetString == testValue)
  					{
  						var is_present = "true";
  					}
  				}//end else

  				if(is_present == "true")
  				{
  					if(modifier == "index")
  					{
  						if(strIndx[0] == -1)
  						{

  							strIndx = [];
  							strIndx = strIndx.concat(i);

  						}else
  						{
  							strIndx = strIndx.concat(i);
  						}//end else


  					}else{

  						if(strIndx[0] == "none")
  						{
  							strIndx = [];
  							strIndx = strIndx.concat(testArray[i]);

  						}else
  						{
  							strIndx = strIndx.concat(testArray[i]);
  						}//end else

  					}//end else modifier

  				}//end if targetString

  			}//end for

  			return strIndx;

  		}//valueChecker

  		/*
      this._(key).toggleSelectDisplay = function()
  		{
  			this._(key).custom_input_id;
  			this._(key).custom_select_id;
  			if()
  			{

  			}else
  			{

  			}

  		}
      */

      if(typeof this.display != "function"){
        masterButtons.prototype.display = function()
        {//this.display
            //var discovery = this._(key).prepElementStringType(homeStr);
            //stringType = discovery.type;
            //home = discovery.target;

            //this._(key).prepStartString();

            switch(this._(key).type)
            {
                case "iconbox":
                    this.iconBoxDisplay();
                break;

                case "buttongroup":
                    this._(key).prepStartString(this._(key));
                    this.groupButtonDisplay();
                break;

                case "tabs":
                    this.tabContentDisplay();
                break;

                case "pills":
                    this.tabContentDisplay();
                break;

                case "list":
      					case "ul":
      					case "ol":
      					case "li":
                    this.listContentDisplay();
                break;

                case "text_box":
                    this.textContentDisplay();
                break;

                case "move_element":
                    this.moveElement();
                break;

                case "move_contents":
                    this.moveElements();
                break;

                case "label_box":
                    this.labelBoxDisplay();
                break;

        				case "tag":
                    this.tagDisplay();
                break;

                case "tags":
                case "tasks":
                case "search_tags":
                    //create the display
                    this.search_tags_form();

                    if(this._(key).has_tag_data == "true" && this._(key).rerun != "true")
                    {
                      //add tag data to the display (view)
                      this._(key).tagsViewer(this._(key),this._(key).tag_data_array,this._(key).tag_data_array_object);

                    }//end if
                break;

                case "filter":
                    this.filterDisplay();
                break;

      					case "text":
      					case "phone":
      					case "checkbox":
      					case "url":

      						this.create_text_input();
      					break;

      					case "select":
      					case "slider":
      						this.create_select();
      					break;


      					case "textarea":
                case "texteditor":
                case "textlog":
      						this.create_textarea();
      					break;

                case "lightbox":
                  this.create_light_box();
                break;


              }//end switch

          }//end display
        }//end if


    	this._(key).dataCheck = function(vKey,objStr)
    	{
    			//sample
    			//vKey.dataCheck({"msg_id":ms_id,"input_id":in_id,"char_limit":character_limit});

    			//msg_id input_id char_limit

    			var objType = objStr.type;
    			var has_tally_cont = (objStr.msg_id != undefined && objStr.msg_id != "") ? "true" : "false";

    		if(objType != "notification")
    		{
    				//message container id string

    			if(has_tally_cont == "true")
    			{
    					var msg_id_str = objStr.msg_id;
    					//message container
    					var msgCont = document.getElementById(msg_id_str);//
    			}//end if

    				//input element id string
            //for use with element ids
    			if(objStr.input_id != undefined && objStr.input_id != "")
    			{
    				var input_id_str = objStr.input_id;
    				//input element
    				var inputEl = document.getElementById(input_id_str);



    				if(objType == "select")
    				{
    					var theIndex = inputEl.selectedIndex;
    					var inputValue = inputEl[theIndex].value;
    					inputEl.value = inputValue;
    					//console.log("input value = "+ inputEl[theIndex].value);
    				}

    				var inputTxt = inputEl.value;//
    			}else if(objStr.data_str != undefined && objStr.data_str != "")
    			{
    				//modification for tags only - phone is left out otherwise
    				var inputTxt = objStr.data_str;

    			}else{
    				//console.log("no datacheck data available or no reference to data");
    				return "";
    			}

    			//get the input text length
    			var inputTxtLength = inputTxt.length;

    			//create the msg string for character limit
    			var char_limit = objStr.char_limit || -1;


    			var char_rem = char_limit - inputTxtLength;
    			if(char_rem < 0){char_rem = 0; inputEl.value = inputTxt.substr(0,char_limit);}

    			var msgStr = "<h7>remaining " + char_rem + "/" + char_limit + "</h7>" ;
    			/*
    			//TODO:120 modify the target element to have a h7 childNode with an id
    			so I can refernce it here and just use text for its innerHTML
    			*/

    			if(has_tally_cont == "true")
    			{
    						if(char_rem < 6){msgCont.style.color = "red";}else{msgCont.style.color = "green";}
    						msgCont.innerHTML = msgStr;
    			}//end if

    			/*if(changeObj[objStr].btn == "text"){*/

    			var lowerStr = 	inputTxt.toLowerCase();

    			var isString = vKey._checkString({'string':lowerStr,'array':vKey.forbidList});

    			if(objStr.input_id != undefined && objStr.input_id != "")
    			{
    				if(isString != -1)
    				{
    					var currentClass = inputEl.className;

    					if(currentClass.indexOf(" valid") != -1)
    					{
    						var modifiedClass = currentClass.replace("valid","invalid");
    						inputEl.className = modifiedClass;
    					}
    					else{
    						//then check for the word invalid so its not repeated
    						//if its not there "== -1" put it there
    						if(currentClass.indexOf(" invalid") == -1)
    						{
    							inputEl.className += " invalid ";
    						}

    					}
    								/*i only have to change it here. I don't have to
    								change it back because it is set above*/

    								var invalidStr = "invalid entry. protected sequence.";
    					if(has_tally_cont == "true"){
    									msgCont.innerHTML = "<h7>" + invalidStr + "</h7>"
    									msgCont.style.color = "red";
    					}//end if
    								//inputEl.dataset.validation = "invalid";
    								//inputEl.validity.valid = false;
    								inputEl.setCustomValidity(invalidStr);

    				}//end if
    				else
    				{
    					var currentClass = inputEl.className;

    					if(currentClass.indexOf(" invalid") != -1)
    					{
    						var modifiedClass = currentClass.replace("invalid","valid");
    						inputEl.className = modifiedClass;
    					}
    					else{
    						//then check for the word valid so its not repeated
    						//if its not there "== -1" put it there
    						if(currentClass.indexOf(" valid") == -1)
    						{
    							inputEl.className += " valid ";
    						}

    					}
    					inputEl.setCustomValidity("");
    				}//end else






    			/*}//end if changeObj*/




    				if(objType == "phone" && inputEl.validity.valid != false)
    				{
    								//12a a3 (202)
    					/*i moved this down because even if it passes the forbidden characters
    					if it doesn't have enough numbers it has to be set to invalid.*/
    					//var reggie = new RegExp("/\d/g");
    					//var phoneNbr0 = inputTxt.match(reggie);//doesn't work
    					//var phoneNbr1 = inputTxt.match(/[0-9]*/g);//works - matches any number
    					//var phoneNbr1 = target_value.match(/[^0-9]*/g);//works - matches any letter
    					//works - matches " " + "ui-icon-wordpress" + " "
    					//var phoneNbr1 = target_value.match(/ui-icon-[^0-9]*\s/g);
    					//var phoneNbr2 = inputTxt.match("\d{1}");//doesn't work
    					//var phoneNbr3 = inputTxt.replace(/[^0-9]/g,'');//works


    					var phoneNbr = inputTxt.replace(/[^0-9]/g,'');//works
    					phoneNbr = phoneNbr.toString();

    					if(phoneNbr.length < 10 && inputTxt != "" )
    					{
    						//invalidate it
    						inputEl.setCustomValidity(invalidStr);
    						var currentClass = inputEl.className;
    						var modifiedClass = currentClass.replace("valid","invalid");
    						inputEl.className = modifiedClass;

    					}
    					else if(phoneNbr.length >= 10 || inputTxt == "" ){
    						//validate it
    						inputEl.setCustomValidity("");
    						var currentClass = inputEl.className;
    						var modifiedClass = currentClass.replace("invalid","valid");
    						inputEl.className = modifiedClass;

    						vKey.formatPhone(input_id_str)
    					}

    				}//end if objStr phone





    				var validity1 = inputEl.checkValidity();
    				var validity2 = inputEl.validity.valid;




    				/*
    				var readyForm = finalTest();
    				//if the form end up being ready give them the go btn
    				if(readyForm == true)
    				{
    					//do something
    				}else{

    					//do something
    				}
    				*/
    				if(validity1 == true && validity2 == true)
    				{
    				  vKey.obj_validity = "valid";
    				  return vKey.obj_validity;

    				}else {
    				  vKey.obj_validity = "invalid";
    				  return vKey.obj_validity;

    				}//end else

    			}//end if(objStr.input_id != undefined && objStr.input_id != "")
    			else
    			{
    			  if(isString != -1){
    				vKey.obj_validity = "invalid";}
    			  else {
    				vKey.obj_validity = "valid";
    			  }//end if

            return vKey.obj_validity;

    			}//end else

    		}//end if !notification

    	}//dataCheck

  		this._(key).formatPhone = function(idStr)
  		{
  			//ulitimately this will work with international numbers
  			//us numbers for now
  			//can read time zone or country?
  			var inputEl = document.getElementById(idStr);
  			var inputTxt = inputEl.value;//

  			var phoneNbr = inputTxt.replace(/[^0-9]/g,'');//works
  				phoneNbr = phoneNbr.toString();


  				if(phoneNbr.length == 10)
  				{
  					phoneArray = new Array();
  					phoneArray[0] = phoneNbr.substr(0,3);
  					phoneArray[1] = phoneNbr.substr(3,3);
  					phoneArray[2] = phoneNbr.substr(6);

  					var new_nbr = "(" + phoneArray[0] + ")" + " " + phoneArray[1] + " - " + phoneArray[2];

  					inputEl.value = new_nbr;
  				}
  				else if(phoneNbr.length > 10)
  				{
  					phoneArray = new Array();
  					phoneArray[0] = phoneNbr.substr(0,1);
  					phoneArray[1] = phoneNbr.substr(1,3);
  					phoneArray[2] = phoneNbr.substr(4,3);
  					phoneArray[3] = phoneNbr.substr(7);

  					var new_nbr = phoneArray[0] + " (" + phoneArray[1] + ")" + " " + phoneArray[2] + " - " + phoneArray[3];

  					inputEl.value = new_nbr;
  				}


  		}//formatPhone

  		this._(key).finalTest = function()
  		{
  			//is one identifier (picture/text) and one contact ready to submit
  			readyId = false;
  			readyContact = false;
  			readyPassword = false;

  			valid_picture = false;
  			valid_text = false;
  			valid_phone = false;
  			valid_email = false;
  			valid_password = false;


  			for(var i = 0;i<this._(key).event_ids.length; i++)
  			{


  				var inputEl = document.getElementById(this._(key).event_ids[i]);
  				var inputStr = inputEl.type;
  				if(inputStr == "picture" || inputStr == "text" || inputStr == "image" )
  				{

  					if(inputEl != null && inputEl != undefined)
  					{
  						var inputTxt = inputEl.value;//

  						if(inputTxt != "" && inputEl.validity.valid != false){
  							readyId = true;
  						}

  						//if it exists is it valid "" or not
  						if(inputStr == "picture" ||  inputStr == "image"){
  							valid_picture = (inputEl.validity.valid != false) ? true : false;
  						}
  						if(inputStr == "text"){
  							valid_text = (inputEl.validity.valid != false) ? true : false;
  						}

  					}//end not null or undefined
  					else
  					{
  						//if it doesn't exist - it may not be ready but at least its valid
  						if(inputStr == "picture" ||  inputStr == "image"){
  							valid_picture = true;
  						}
  						if(inputStr == "text"){
  							valid_text = true;
  						}

  					}//end else
  				}

  				if(inputStr == "email" || inputStr == "phone" )
  				{

  					if(inputEl != null && inputEl != undefined)
  					{
  						var inputTxt = inputEl.value;//

  						if(inputTxt != "" && inputEl.validity.valid != false){
  							readyContact = true;
  						}

  						//if it exists is it valid "" or not
  						if(inputStr == "phone"){
  							valid_phone = (inputEl.validity.valid != false) ? true : false;
  						}
  						if(inputStr == "email"){
  							valid_email = (inputEl.validity.valid != false) ? true : false;
  						}

  					}//end not null or undefined
  					else
  					{
  						//if it doesn't exist - it may not be ready but at least its valid
  						if(inputStr == "phone"){
  							valid_phone = true;
  						}
  						if(inputStr == "email"){
  							valid_email = true;
  						}

  					}//end else


  				}

  				if(inputStr == "notification" )
  				{
  					if(document.getElementById("us_msg_slider_Select"))
  					{
  						var msgSel = document.getElementById("us_msg_slider_Select");
  						var selectedOption = document.getElementsByClassName("msg_slider")[msgSel.selectedIndex];
  						if(selectedOption.value == "allow"){readyContact = true;}

  					}//end if
  				}


  				if(inputStr == "password" )
  				{
  					if(inputEl != null && inputEl != undefined)
  					{
  						var inputTxt = inputEl.value;//

  						if(inputTxt != "" && inputEl.validity.valid != false){
  							readyPassword = true;
  						}

  						//if it exists is it valid "" or not
  						if(inputStr == "password"){
  							valid_password = (inputEl.validity.valid != false) ? true : false;
  						}

  					}//end not null or undefined
  					else
  					{
  						//if it doesn't exist - it may not be ready but at least its valid
  						if(inputStr == "password"){
  							valid_password = true;
  						}

  					}//end else


  				}

  			}//end for


  			var isReady = (readyId == true && readyContact == true) ? true : false;
  			isValid = (valid_picture == true && valid_text == true && valid_phone == true
  			&& valid_email == true && valid_password == true) ? true : false;
  			if(isReady == true && isValid == true)
  			{
  				return true;
  			}
  			else
  			{
  				return false;
  			}


  		}//end finalTest

  		this._(key).giveItAGo = function()
  		{
  			//alert(document.getElementById("us_sel_go_btn"));
  			if(!document.getElementById("us_sel_go_btn"))
  			{

  				var targContain = document.getElementById("simple_connect_Cont");
  				//depreciated go btn - maybe at the end as a submit
  				var goEl = document.createElement('button');
          goEl.id = this._(key).prefix + "_go_btn_" + this._(key).iUN;
          goEl.className = this._(key).prefix + "_go_btn_" + this._(key).iUN + " " + this._(key).prefix + "_go_btn" + " go_btn ui-btn ui-icon-check ui-btn-icon-left ui-btn-icon-notext";
  				//goEl.setAttribute("onclick","onScreen()");
  				goEl.setAttribute("onclick",function(e){

            e.preventDefault();

            if(this._(key).has_go_callout == "true")
            {
                var go_callout_fn = this._(key).go_callout_params[0];
                go_callout_fn(e,this.id,this._(key).go_callout_params[1],this._(key).go_callout_params[2],this._(key).go_callout_params[3],this._(key).go_callout_params[4],this._(key).go_callout_params[5]);

            }//end if

          });
  				goEl.innerHTML = "<h4>OK</h4>";
  				goEl.title = "make contact";


  				targContain.appendChild(goEl);/**/
  			}

  		}//end giveItAGo

  		this._(key).extractData = function(vKey,dId,in_type)
  		{
  			var targ_el = document.getElementById(dId);
  			//event_ids
  			var selectValue = targ_el.value;
  			vKey.currentValue = (vKey.fixed_value == "false") ? selectValue : vKey.currentValue;
  		}//end extractData

  		this._(key).extractData3 = function(vKey,dId,in_type)
  		{
  			//mainly used to get the slider up to date
  			//to attach an additional function to the slider i had to use jquery
  			//ex. $("#"+accSlide_id).change(function(){});
  			var data_values = [];
  			for(var u = 0; u < vKey.event_ids.length; u++){
  				var cur_id = vKey.event_ids[u]
  				var targ_el = document.getElementById(cur_id);
  				//event_ids
  				var selectValue = targ_el.value;
  				data_values = data_values.concat(selectValue);
  			}
  			return data_values;
  		}//end extractData3

  		this._(key).extractData2 = function(vKey,dId,in_type)
  		{
  			var targ_el = document.getElementById(dId);
  			//event_ids

  			switch(in_type)
  			{
  				case "select":
  				case "slider":
  					var select_ndx = targ_el.selectedIndex;
  					var optClass_Str = vKey.prefix + "_SOption"
  					var selectOption = document.getElementsByClassName(optClass_Str)[select_ndx];
  					var selectValue = selectOption.value;
  					//console.log("selected value - long way",selectValue);
  					//console.log("target id value ",targ_el.value);//theyre the same

  					vKey.currentValue = (vKey.fixed_value == "false") ? selectValue : vKey.currentValue;
  				break;

  				case "textarea":
  				case "text":
  				case "phone":
  					selectValue = targ_el.value;
  					vKey.currentValue =  (vKey.fixed_value == "false") ? selectValue : vKey.currentValue;
  				break;

  				case "checkbox":
  					selectValue = targ_el.value;
  					vKey.currentValue = (vKey.fixed_value == "false") ? selectValue : vKey.currentValue;
  				break;

  			}//end swith
  		}//end extractData2

      if(typeof this.getCurrentValue != "function"){masterButtons.prototype.getCurrentValue = function(){return this._(key).currentValue;}}

      if(typeof this.getCurrentValue2 != "function"){masterButtons.prototype.getCurrentValue2 = function(){return this._(key).extractData3(this._(key));}}

      if(typeof this.get_edit_object != "function")
      {
        masterButtons.prototype.get_edit_object = function()
        {
          var vKey = this._(key);

          let textVal1 = vKey.htmlDecode(vKey,vKey.currentValue);
          let textVal2 = vKey.htmlDecode(vKey,textVal1);//a second cleaning
          //this should preserve the values from an alternate textarea format
          vKey.edit_object.text = (vKey.type == "textarea" || vKey.edit_object.text == "") ? textVal2 : vKey.edit_object.text;
          vKey.edit_object.html = (vKey.type != "textarea" || vKey.edit_object.html == "") ? vKey.currentValue : vKey.edit_object.html;
          //vKey.edit_object = {"html":vKey.currentValue,"text":textVal};
          return vKey.edit_object;
        }
      }///end if get_edit_object

      if(typeof this.set_edit_object != "function"){masterButtons.prototype.set_edit_object = function(eObj){this._(key).edit_object = eObj;}}

      this._(key).htmlDecode = function(vKey,input)
  		{
  		  var doc = new DOMParser().parseFromString(input, "text/html");
  		  return doc.documentElement.textContent;
  		}//end htmlDecode

    }//end masterButtons object


      return masterButtons;

    }()//end masterButtons


    function minorButtons(objStr)
    {
        //alert("minor buttons running");
        var e = event || window.event;
        //then activates that target
        var current_Btn = e.srcElement;

        var action = objStr.action;
        var objectName = objStr.objectName;

        switch(action)
        {
            case "showCaseIcon":
                window[objectName].showCaseIcon();
            break;

            case "chooseButton":
                window[objectName].chooseButton();
                 //window[objectName].getSelectedButton();//works
            break;

            case "switchTabs":
                window[objectName].switchTabs();
                 //window[objectName].getSelectedButton();//works
            break;

            case "changeDisplayIcon":
                var toggle = objStr.toggle;
                window[objectName].changeDisplayIcon(toggle);
                 //window[objectName].getSelectedButton();//works
            break;



        }

    }//end minorButtons

	function validityCheck(objAry)
	{
		/********  sample use *********

		var event_id_array = uNote.get_event_ids();
		var targetElement = document.getElementById(event_id_array[0]);
		targetElement.onclick = function(){

		targetElement.onclick = function(){

			var form_id_Ary = [];
				//alert("id additions work")
				//check group for validity
				form_id_Ary.push(testTxt.get_event_ids().join());
				form_id_Ary.push(testTag.get_event_ids().join());
				form_id_Ary.push(txAre.get_event_ids().join());
				console.log(form_id_Ary);

				var isReady = validityCheck(form_id_Ary);

				if(isReady == true)
				{
				...

		********  sample use *********/

		var id_Array = objAry;
		var readyForm = true;

		for(var r = 0; r < id_Array.length; r++)
		{
			var targEl = document.getElementById(id_Array[r]);
			targEl.checkValidity();
			targEl.validity.valid;

			if(targEl.checkValidity() == false || targEl.validity.valid == false){readyForm = "invalid"; return readyForm;}

			if(targEl.dataset.required == "true" && targEl.style.display != "none")
			{
				if(targEl.value == ""){readyForm = "incomplete"; return readyForm;}
			}

		}//end for

		return readyForm;


	}//end validityCheck


    /*
                //this are public and vars are private

                var testVariable1 = "Success Var";
                this.testVariable1 = "not the same as var";
                this.testVariable2 = "Success this";
                var hideAway = "quick hide!";

                var getPrivate1 = function(){return hideAway;}

                this.getPrivate2 = function(){return getPrivate1();}


                //object oriented javascript test
                var miko = new masterButtons();
                var t1 = miko.testVariable1;
                var t2 = miko.testVariable2;
                //var gp1 = miko.getPrivate1(); //calling private functions result in errors and breaks
                miko.testVariable1 = "too much";
                var t3 = miko.testVariable1;

                var gp2 = miko.getPrivate2();


                // object properties
                var .objectName = obj.name;
                thisobjectName = objectName;
                function someThing()
                {return "" + this.objectName;}//doesn't work

                this.getObjectName = function(){return someThing();}


                //public script
                 var miko = new masterButtons({name:'miko'});
                var oN = miko.getObjectName();//returns undefined

                        gBut.groupButtonDisplay();
        gBut.home;
        gBut.setHome('homie');
        gBut.home;// returned summat??
        gBut.home = "summat";
        gBut.home;//returned summat
        var wh = gBut.getHome();//this was correct with homie and summat



    */

               /*****************      radio btn experiment     ********************/

           //option naming scheme for option id is form field "jform" + "form name" + index# - ex. jform_display_icon0

           //gets the form's name
            //var bVTest = document.getElementsByClassName('display_icon')[0];
            //bVTest.elements[0].checked = "checked";
            //var tval = bVTest.elements[0].value;//calls the option element node 0
            //var tC = bVTest.elements[0].checked;//tests for checked or not

            //var jF = document.getElementById('jform_display_icon0');//equivalent to calling the option element
            //var tC2 = jF.checked;//tests for checked
            //var tVal2 = jF.value;//contains value
            //var tClass = jF.this._(key).labels[0].className;//usefull for class name changes on the label element.

            //jF.this._(key).labels[0].className = "btn active btn-success";// "btn" or "active btn-success/active btn-danger"
            //var jFT = document.getElementById('jform_display_icon0').this._(key).labels[0].innerText;



             /*****************      end radio btn experiment     ********************/
