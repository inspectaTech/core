    //alert('masterImage running');

    //console.log("snakes running");
    /********************************************************************************************************

    //dependencies
    JQuery
    JQueryMobile

    //cors enableing solution
    //https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image



    sample data:
    obj_elements.prev_img = new masterImage({home:'prev_cont',url:targetElement.value,type:"profile"});
    obj_elements.prev_img.setCustomClass("prev_img");

    //this one sets the view for pre-edited images
    if(dpi_obj.extra != undefined && dpi_obj.extra != "")
    {

      obj_elements.prev_img.setView(dpi_obj.extra);

    }else
    {
      //otherwise start from scratch
      obj_elements.prev_img.setRawDisplay();
    }

    obj_elements.prev_img.display();





    *********************************************************************************************************/

    function masterImage(mstrObj){
    //Image Tool Kit
    //console.log("in the pit");
    //properties
    //required

    if(mstrObj == undefined){alert("canvas object parameter is not defined."); return;}
    if(mstrObj.home == undefined){alert("canvas object needs \"home:'container id string'\"."); return;}
    var home = mstrObj.home;

    var iUN = mstrObj.iUN || Math.round(Math.random() * 10000);//see iUN get and set
    var canvas_type = mstrObj.type || "thumbnail";//profile, raw, banner?
    var canvas_mode = mstrObj.mode || "default";


    //at 100 x100 or 50 x50 the image is adjusted perfectly
    //100 x 80 the image is stretched
    //NOTE image 4:3 aspect ratio multiply by 3/4ths or .75
    var type_str = (canvas_mode != "default") ? canvas_type + "_" + canvas_mode : canvas_type;

    //used to set the various canvas default dimensions (if they arent manually entered)
    switch(type_str)
    {
      case "thumbnail":
        var default_width = 50;
        var default_height =  50;
      break;

      case "profile":
        var default_width = 100;
        var default_height = 100;
      break;

      case "profile_edit":
        var default_width = 200;
        var default_height = 200;
      break;

      case "image":
        var default_width = 100;
        var default_height = 75;
      break;
    }//end switch




    var canvas_width = mstrObj.width || default_width;
    var canvas_height = mstrObj.height || default_height;


    //HTML generated variable
    //window['CANVAS_IMG_URL'] = "<?php echo JUri::root(); ?>components/com_arc/xfiles/images/";
    var img_default = window['ARC_IMG_URL'] + "flame.png";
    var auto_validate = "false";

    //properties
    var canvas = "";
    var mini_canvas = "";
    var context_obj = "";
    var mini_context = "";
    var action = mstrObj.action || "";
    var prefix = mstrObj.varName || "masImg";//get set
    var fill_content = "";
    //console.log(display);
    var custom_class = "";
    var add_to_class = "false";
    var parent_class = "";
    var custom_id = "";
    var id_type = "default";
    var first_run = "true";
    var sli_ctrl_inputA = "";
    var	sli_ctrl_inputB = "";
    var mousedown =  false;
    var touchdown = false;
    var last_panel_clicked_id = "";//remove
    var last_x = "default";
    var last_y = "default";
    var offset_x = 0;
    var offset_y = 0;
    var img_label = "default";
    var slide_limit = 500;
    var current_state = "initial";//other state is modified
    var initial_view = "";
    //var display_size = "default";
    var drawData = "false";
    var data_w = "";
    var data_h = "";
    var clearHome = "true";
    //var external_canvas = "false";
    var current_display = mstrObj.display ||  canvas_mode;


    var img_url = (mstrObj != undefined && mstrObj.url != undefined) ? mstrObj.url : img_default;
    var img_data = "";
    var canvas_data = "";

    //obj_globals
    var src_x = 0;
    var src_y = 5;
    var img_w = 500;
    var img_h = 500;
    var can_x = 0;
    var can_y = 0;
    var can_w = canvas_width;
    var init_can_w = canvas_width;//this helps to establish a baseline for the zoom feat.
    var can_h = canvas_height;


    //NOTE I don't need this. won't be saving this to local storage #remove
    /*try{
    if(localStorage != undefined && localStorage.canvas_tutorial != undefined && localStorage.canvas_tutorial != "")
    {
      var local_str = localStorage.canvas_tutorial;
      var local_ary = local_str.split(",");
      img_url = local_ary[0];
      src_x = local_ary[1];
      src_y = local_ary[2];
      img_w = local_ary[3];
      img_h = local_ary[4];
      can_x = local_ary[5];
      can_y = local_ary[6];
      can_w = local_ary[7];
      can_h = local_ary[8];
    }//end if
    }catch(e){
      console.log("nope. reload failed.")
    }*/

    var obj_els = {};
    var event_ids = [];
    var has_load_callout = "false";
    var load_callout_params = ["","","","","","","",""];
    var has_go_callout = "false";
    var go_callout_params = ["","","","","","","",""];
    var has_can_callout = "false";
    var can_callout_params = ["","","","","","","",""];
    var has_err_callout = "false";
    var err_callout_params = ["","","","","","","",""];


    //methods
    this.setContent = function(sC){fill_content = sC;}//
    this.get_event_ids = function(){return event_ids;}
    this.setCustomClass = function(clsStr,addPar){custom_class = clsStr; add_to_class = addPar || true;/*addPar is nothing yet*/}
    this.setParentClass = function(clsStr){parent_class = clsStr;}
    this.setCustomId = function(cId){custom_id = cId; id_type = "custom";}
    this.getImgData = function(){return {"url":img_url,"data_type":"canvas_data","canvas_data":canvas_data};}
    this.setUrl = function(str){img_url = str};
    this.setRawDisplay = function(){canvas_mode = "raw"; type_str = canvas_type + "_" + canvas_mode;}
    this.clearHome = function(str){clearHome = str};
    this.setDefaultImg = function(str){img_default = str;};
    this.autoValidate = function(){auto_validate = "true";};

    this.setView = function(drawString)
    {
      setView(drawString);
    }//end setView

    var setView = function(drawString)
    {
      drawData = "true";
      var drawString_ary = drawString.split(",");
      data_w = drawString_ary[9];
      data_h = drawString_ary[10];


      img_url = drawString_ary[0];

      //if(img_url == img_default){}

      src_x = drawString_ary[1];
      src_y = drawString_ary[2];
      img_w = drawString_ary[3];
      img_h = drawString_ary[4];
      can_x = drawString_ary[5];
      can_y = drawString_ary[6];
      can_w = drawString_ary[7];
      can_h = drawString_ary[8];

      initial_view = [img_url, src_x, src_y, img_w, img_h, can_x, can_y, can_w, can_h, canvas_width, canvas_height].join();

    }//end setView

    this.setLoadCallout = function()
    {
      /*sample use
      if(has_load_callout == "true")
      {
          var load_callout_fn = load_callout_params[0];
          load_callout_fn(load_callout_params[1],load_callout_params[2],load_callout_params[3],load_callout_params[4],load_callout_params[5]);

      }//end if
      */
      has_load_callout  = (arguments.length != 0) ? "true" : "false";
      for(var i = 0; i < arguments.length; i++)
      {
        load_callout_params[i] = arguments[i];

      }//end for

    }//end setLoadCallout

    this.setGoCallout = function()
    {
          /*sample use
        if(has_go_callout == "true")
        {
            var go_callout_fn = go_callout_params[0];
            go_callout_fn(go_callout_params[1],go_callout_params[2],go_callout_params[3],go_callout_params[4],go_callout_params[5]);

        }//end if
        */
        has_go_callout = (arguments.length != 0) ? "true" : "false";
        for(var i = 0; i < arguments.length; i++)
        {
          go_callout_params[i] = arguments[i];

        }//end for

    }//end setGoCallout

    this.setCancelCallout = function()
    {
          /*sample use
        if(has_can_callout == "true")
        {
            var can_callout_fn = go_callout_params[0];
            can_callout_fn(can_callout_params[1],can_callout_params[2],can_callout_params[3],can_callout_params[4],can_callout_params[5]);

        }//end if
        */
        has_can_callout = (arguments.length != 0) ? "true" : "false";
        for(var i = 0; i < arguments.length; i++)
        {
          can_callout_params[i] = arguments[i];

        }//end for

    }//end setCancelCallout

    this.setErrorCallout = function()
    {
          /*sample use
        if(has_err_callout == "true")
        {
            var err_callout_fn = err_callout_params[0];
            err_callout_fn(err_callout_params[1],err_callout_params[2],err_callout_params[3],err_callout_params[4],err_callout_params[5]);

        }//end if
        */
        has_err_callout = (arguments.length != 0) ? "true" : "false";
        for(var i = 0; i < arguments.length; i++)
        {
          err_callout_params[i] = arguments[i];

        }//end for

    }//end setErrorCallout


    this.runDataCheck = function(){

      return canvas_validity;

    }//end runDataCheck


    //i don't need external data because the edit mode doesn't actually change anything it just preps data
    //for use elsewhere
    //this.setExternalCanvas = function(xId){external_canvas = "true"; external_id = xId;}//can be a className

    var image_object = new Image();
    //image_object.setAttribute('crossOrigin', 'anonymous');


     var create_canvas = function(c_cont){

       var bigDaddy = (document.getElementById(c_cont)) ? document.getElementById(c_cont) : document.getElementsByClassName(c_cont)[0];
        //clears container
        if(clearHome == "true"){
          bigDaddy.innerHTML = "";//
        }

        /********************************  Sample Code  *****************************************

        ***************************************************************************************/

              //alert("data object is " + dataObject);
              //gets container


          var add_custom_class = (custom_class != "") ? custom_class  : "";
          var add_parent_class = (parent_class != "") ? parent_class  : "";

          canvas = document.createElement("canvas");
          canvas.id = prefix + "_ImgCanvas" + iUN;

          //event_ids.push(canvas.id);
          event_ids = [canvas.id];

          canvas.className = prefix + "_ImgCanvas" + iUN + " " + prefix + "_ImgCanvas ImgCanvas responsive_canvas " + add_custom_class;

          if(fill_content != ""){canvas.innerHTML = fill_content;}

          bigDaddy.appendChild(canvas);

          context_obj = canvas.getContext('2d');
          canvas.width = canvas_width;
          canvas.height = canvas_height;

          if(canvas_mode == "edit")
          {
            //create a mini preview
            mini_canvas = document.createElement("canvas");
            mini_canvas.id = prefix + "_mini_canvas" + iUN;
            mini_canvas.className = prefix + "_mini_canvas" + iUN + " " + prefix + "_mini_canvas mini_canvas responsive_canvas " + add_custom_class;

            var mini_home = document.getElementsByClassName("edit_preview_box")[0];
            mini_home.appendChild(mini_canvas);
            mini_home.style.width = canvas_width / 2 + "px";
            mini_home.style.height = canvas_height / 2 + "px";
            mini_context = mini_canvas.getContext('2d');


          }

          //set parents inline w,h
          var canvas_parent = canvas.parentNode;
          switch(type_str)
          {
            //is set like using this above
            //var type_str = (canvas_mode != "default") ? canvas_type + "_" + canvas_mode : canvas_type;
            case "thumbnail":

            break;

            case "profile":
              canvas_parent.className += (canvas_parent.className.indexOf("d3-profile-rounded") == -1) ? " d3-profile-rounded " : "";
              //console.log(canvas_parent.className);
            break;

            case "profile_edit":
              mini_canvas.className += (mini_canvas.className.indexOf("d3-profile-rounded") == -1) ? " d3-profile-rounded " : "";

            break;

            case "image":

            break;

            //this is used to show raw image
            //coresponding code : setRawDisplay & probably this entire switch (initially)
            case "profile_raw":
            case "thumbnail_raw":
              canvas_mode = "default";
              type_str = (canvas_mode != "default") ? canvas_type + "_" + canvas_mode : canvas_type;
            break;
          }//end switch

          canvas_parent.className += (canvas_parent.className.indexOf(add_parent_class) == -1) ? " " + add_parent_class + " " : "";
          //can_par.style.width = canvas_width;
          //can_par.style.height = canvas_width;


     }//end create_preview

    var draw_me = function() {

       //console.log("draw running");

      //clear the canvas
      //canvas.width = canvas.width;
      var add_custom_class = (custom_class != "") ? custom_class  : "";

            if (canvas.getContext) {

              image_object.onload=function(){

                if(current_state == "initial" && drawData != "true"){

                    //study: this is the section to get the
                    //images initial settings
                    img_w = image_object.naturalWidth;
                    img_h = image_object.naturalHeight;

                    //for this to work without stretching
                    //the last parameters have to match
                    //the image parameters

                    //this calculates larger image issues
                    if(img_w > img_h){
                      can_w = (img_w > canvas.width) ?
                      canvas.width : img_w;
                      can_h = img_h / (img_w / canvas.width);
                      slide_limit = img_w;
                    }else{
                      can_h = (img_h > canvas.height) ?
                      canvas.height : img_h;
                      can_w = img_w / (img_h / canvas.height);
                      slide_limit = img_h;
                    }//end else calculations

                    //console.log(image_object.naturalWidth);
                    //console.log(image_object.naturalHeight);
                    init_can_w = can_w;
                    //center script
                    can_x = (canvas.width - can_w) / 2;
                    can_y = (canvas.height - can_h) / 2;

                    current_state = "modified";

                    initial_view = [img_url, src_x, src_y, img_w, img_h, can_x, can_y, can_w, can_h, canvas_width, canvas_height].join();

                    drawData = "true";

                }//end if


                //needs this to keep drawing movements smooth
                canvas.width = canvas_width;
                canvas.height = canvas_height;

                if(drawData == "true")
                {

                  var scale_factor = canvas_width / data_w;

                  //i don't think it needs both w & h.  It scales by ratio 1:1 width and height.
                  //if the container is different it may throw off the scaling
                  context_obj.scale(scale_factor,scale_factor);

                }//end if
                context_obj.drawImage(image_object, src_x, src_y, img_w, img_h, can_x, can_y, can_w, can_h);
                //console.log("image_object",image_object);//try here

                //prep the output
                //img_data = canvas.toDataURL();
                //canvas_data = JSON.stringify({"url":img_url,"src_x":src_x, "src_y":src_y, "img_w":img_w, "img_h":img_h, "can_x":can_x, "can_y":can_y, "can_w":can_w, "can_h":can_h});

                canvas_data = [img_url, src_x, src_y, img_w, img_h, can_x, can_y, can_w, can_h, canvas_width, canvas_height].join();

                /*
                if(canvas_mode != "edit")
                {
                  image_object.id = prefix + "_imgDisp" + iUN;
                  image_object.className = prefix + "_imgDisp" + iUN + " " + prefix + "_imgDisp " + " imgDisp " + add_custom_class;
                  image_object.src = img_data;

                  var my_home = canvas.parentNode;
                  my_home.replaceChild(image_object,canvas);
                  event_ids = [image_object.id];
                  //switch the canvas for the image

                }
                */

                if(canvas_mode == "edit")
                {
                  //create a mini preview
                  var mini_scale_factor = .5;
                  mini_canvas.width = canvas_height * mini_scale_factor;
                  mini_canvas.height = canvas_height * mini_scale_factor;

                  mini_context.scale(mini_scale_factor,mini_scale_factor);

                  mini_context.drawImage(image_object, src_x, src_y, img_w, img_h, can_x, can_y, can_w, can_h);

                }//end if

                canvas_validity = "valid";

                //console.log("running load section");
                if(has_load_callout == "true")
                {
                  //console.log("running load section");
                    var load_callout_fn = load_callout_params[0];
                    load_callout_fn(load_callout_params[1],load_callout_params[2],load_callout_params[3],load_callout_params[4],load_callout_params[5]);

                }//end if

              //  canvas.checkValidity();
              console.log("img loaded");


              }//end onload//

              image_object.onerror = function()
              {
                //canvas.checkValidity();
                canvas_validity = "invalid";

                if(auto_validate == "true" && canvas_validity == "invalid")
                {
                  console.log("registered img error");
                  img_url = img_default;
                  auto_validate = "finished";
                  draw_me();

                }//end if

                if(has_err_callout == "true")
                {
                    var err_callout_fn = err_callout_params[0];
                    err_callout_fn(err_callout_params[1],err_callout_params[2],err_callout_params[3],err_callout_params[4],err_callout_params[5]);

                }//end if has_err_callout

              }//end onerror


              image_object.src=img_url;
              //console.log("image_object",image_object);//nothing to run yet here so its ""
              //var dataURL = canvas.toDataURL("image/png");
              //console.log("image_object height = ",image_object.height);
            }//end if


        }//end draw_me

        var canvas_editor = function()
        {



        }//end canvas_editor


        var display = function(){
          switch(canvas_mode)
          {
            case "edit":
              //prep edit elements that add canvas
              control_panel();
              //draw it
              draw_me();
            break;

            default:
              create_canvas(home);
              draw_me();
            break;

          }//end switch
        }//end display

        this.display = function(){
          display();
        }


        /********************************   SCRAP SECTION BELOW   ****************************************/

        //NOTE i don't need this panel array - i will need a btn array in its place.
        var ctrl_ary = [
        {
        "label":"POSIION",
        "contents":"IP",
        "title":"Image Position",
        "class":" d3-btn "
        },
        {
        "label":"SCALE",
        "contents":"IS",
        "title":"Image Scale",
        "class":" d3-btn "
        },
        {
        "label":"BORDERS",
        "contents":"CB",
        "title":"Canvas Borders",
        "class":" d3-btn "
        },
        {
        "label":"BORDER SCALE",
        "contents":"BS",
        "title":"Canvas Border scale",
        "class":" d3-btn "
        },
        {
        "label":"BACKGROUND COLOR",
        "contents":"BC",
        "title":"Background Color",
        "class":" d3-btn "
        },
        {
        "label":"RESET",
        "contents":"RE",
        "title":"Reset All",
        "class":" d3-btn "
        }

        ];//end ctrl_ary

         var size_ary = [
        {
        "label":"zoom in",
        "contents":"ZI",
        "id":"zoom_in",
        "class":"zoom_in zoom_ctrls d3-ui ui-icon-plus ",
        "title":"zoom in closer for more detail"
        },
        {
        "label":"zoom center",
        "contents":"ZC",
        "id":"zoom_center",
        "class":"zoom_center zoom_ctrls",
        "title":"center the image"
        },
        {
        "label":"zoom out",
        "contents":"ZO",
        "id":"zoom_out",
        "class":"zoom_out zoom_ctrls d3-ui ui-icon-minus ",
        "title":"zoom out for a wider view"
        }
        ];//end size_ary

        //size_ary.reverse();

      var control_panel = function(){

        //object properties


        //local variables

        //jqm collapsible
        var bigDaddy = document.getElementsByClassName(home)[0];
        //clear the container
        bigDaddy.innerHTML = "";

        var edit_box = document.createElement("div");
        edit_box.id = "edit_box" + iUN;
        edit_box.className = "edit_box" + iUN + " edit_box ";//test_orange
        //collapsible set


        //make the other Stuff

        //edit_sectionB
        var edit_sectionB = document.createElement("div");
        edit_sectionB.id = "edit_sectionB" + iUN;
        edit_sectionB.className = "edit_sectionB" + iUN + " edit_sectionB ";//test_blue

            //canvas_cont
            var canvas_cont = document.createElement("div");
            canvas_cont.id = "canvas_cont" + iUN;
            canvas_cont.className = "canvas_cont" + iUN + " canvas_cont ";//test_purple
  obj_els["edit_home_id"] = canvas_cont.id;



            //edit_slider_box
            var edit_slider_box = document.createElement("div");
            edit_slider_box.id = "edit_slider_box" + iUN;
            edit_slider_box.className = "edit_slider_box" + iUN + " edit_slider_box ";//test_yellow

                //edit_lock_box
                var edit_lock_box = document.createElement("div");
                edit_lock_box.id = "edit_lock_box" + iUN;
                edit_lock_box.className = "edit_lock_box" + iUN + " edit_lock_box test_pink";

                          //edit_lock_box
                var edit_slider_cont = document.createElement("div");
                edit_slider_cont.id = "edit_slider_cont" + iUN;
                edit_slider_cont.className = "edit_slider_cont" + iUN + " edit_slider_cont ";//test_green


            edit_slider_box.appendChild(edit_slider_cont);
            edit_slider_box.appendChild(edit_lock_box);



                                //edit_resize_box
            var edit_resize_box = document.createElement("div");
            edit_resize_box.id = "edit_resize_box" + iUN;
            edit_resize_box.className = "edit_resize_box" + iUN + " edit_resize_box ";


        //$(".ctrl_cont").addClass("hibernate");
        //$(".col_label").removeClass("hide");
        edit_sectionB.appendChild(edit_resize_box);
        edit_sectionB.appendChild(canvas_cont);
        edit_sectionB.appendChild(edit_slider_box);
        edit_box.appendChild(edit_sectionB);

        //edit_cmd_label
            var edit_xtra_ctrls = document.createElement("div");
            edit_xtra_ctrls.id = "edit_xtra_ctrls" + iUN;
            edit_xtra_ctrls.className = "edit_xtra_ctrls" + iUN + " edit_xtra_ctrls";
                          //edit_cmd_label
                var edit_cmd_label = document.createElement("div");
                edit_cmd_label.id = "edit_cmd_label" + iUN;
                edit_cmd_label.className = "edit_cmd_label" + iUN + " edit_cmd_label";


                var ctrl_box = document.createElement("div");
                ctrl_box.id = "ctrl_box" + iUN;
                ctrl_box.className = "ctrl_box" + iUN + " ctrl_box edit_sectionA ";



        edit_xtra_ctrls.appendChild(ctrl_box);
        edit_xtra_ctrls.appendChild(edit_cmd_label);
        edit_box.appendChild(edit_xtra_ctrls);

        var edit_preview = document.createElement("div");
        edit_preview.id = "edit_preview" + iUN;
        edit_preview.className = "edit_preview" + iUN + " edit_preview test_green";

        var edit_preview_box = document.createElement("div");
        edit_preview_box.id = "edit_preview_box" + iUN;
        edit_preview_box.className = "edit_preview_box" + iUN + " edit_preview_box tes_purple";

        edit_preview.appendChild(edit_preview_box);
        edit_box.appendChild(edit_preview);

        bigDaddy.appendChild(edit_box);




        var test_nbr = 3;
        //content for ctrl_box
        for(var x = 0; x < ctrl_ary.length ; x++){

          var ec_Nm = "edit_ctrl_btn" + x;
          var edit_ctrl_btn = document.createElement("button");
          edit_ctrl_btn.id = "edit_ctrl_btn" + iUN + "_" + x;
          edit_ctrl_btn.className = "edit_ctrl_btn" + iUN + "_"  + x + " edit_ctrl_btn" + x + " edit_ctrl_btn " + ctrl_ary[x].class;
          edit_ctrl_btn.setAttribute("href","#");
          edit_ctrl_btn.dataset.nbr = x;
          edit_ctrl_btn.dataset.contents = ctrl_ary[x].contents;
          edit_ctrl_btn.title = ctrl_ary[x].title;
          //edit_ctrl_btn.innerHTML = "<h5>" + ctrl_ary[x].label + "</h5>";
          obj_els[ec_Nm] = edit_ctrl_btn;

          //helps set up the correct call inside the event listener
          obj_els["contents" + x] = ctrl_ary[x].contents;


          obj_els[ec_Nm].addEventListener("click",function(e){
            //i used this.dataset so it doesn't pass the updated x of the for loop
            //and everything ending up being on click of the last index nbr passed
            e.preventDefault();
            var sNbr = this.dataset.nbr;
            var my_contents = this.dataset.contents
            run_contents(my_contents);
          })//end c_Nm

         ctrl_box.appendChild(edit_ctrl_btn);

        }//end for


        //content for edit_resize_box
         for(var y = 0; y < size_ary.length ; y++){

          var er_Nm = "zoom_ctrls" + y;
          var zoom_ctrls = document.createElement("button");
          zoom_ctrls.id = size_ary[y].id + iUN + "_" + y;
          zoom_ctrls.className = size_ary[y].id + iUN + "_"   + y + " " + size_ary[y].id + y
          + " " + size_ary[y].class + " " ;
          zoom_ctrls.setAttribute("href","#");
          zoom_ctrls.dataset.nbr = y;
           zoom_ctrls.dataset.contents = size_ary[y].contents;
          zoom_ctrls.title = size_ary[y].title;
          //zoom_ctrls.innerHTML = "" + size_ary[y].label + "";
          obj_els[er_Nm] = zoom_ctrls;

          //helps set up the correct call inside the event listener
          //i dont think this works (think thats why i used dataset)
          obj_els["contents" + y] = size_ary[y].contents;


          obj_els[er_Nm].addEventListener("click",function(e){
            //i used this.dataset so it doesn't pass the updated x of the for loop
            //and everything ending up being on click of the last index nbr passed
            e.preventDefault();
            var sNbr = this.dataset.nbr;
            var my_contents = this.dataset.contents
            run_contents(my_contents);
          })//end c_Nm

         edit_resize_box.appendChild(zoom_ctrls);

        }//end for

        create_canvas(obj_els["edit_home_id"]);
        run_contents("IP");

      }//end control_panel

      var zoom = function(dir)
      {
        //console.log("zoom running");
        switch(dir)
        {
          case "in":

            //imposes a zoom limit
            if(can_w < init_can_w * 8)
            {

              //img_w = img_w / 2;
              can_w = can_w * 1.5;
              can_h = can_h * 1.5;

              //center formula
              can_x = (canvas.width - can_w) / 2;
              can_y = (canvas.height - can_h) / 2;

              current_state = "modified";
              draw_me();

            }//if limit

          break;

          case "out":

            //imposes a zoom limit
            if(can_w > init_can_w / 5)
            {
                 //img_w = img_w / 2;
                can_w = can_w / 1.5;
                can_h = can_h / 1.5;

                //center formula
                can_x = (canvas.width - can_w) / 2;//
                can_y = (canvas.height - can_h) / 2;

                //current_state = "modified";
                draw_me();
            }//end limit
          break;

        }//end zoom

      }//end zoom


      var center_me = function()
      {

        can_x = (canvas.width - can_w) / 2;
        can_y = (canvas.height - can_h) / 2;

        current_state = "modified";
        draw_me();


      }//end center_me



      var run_contents = function(str)
      {
        switch(str)
        {
          case "IP":
            //image position
            add_slider_input(0);
          break;

          case "IS":
            //image scale
            add_slider_input(1);
          break;

          case "CB":
            //canvas border
            add_slider_input(2);
          break;

          case "BS":
            //canvas border scale
            add_slider_input(3);
          break;

          case "BC":

          break;

          case "RE":
            reset_canvas();
          break;

            //resize section
          case "ZI":

            zoom("in");

          break;

          case "ZC":

            reset_canvas();

          break;

          case "ZO":

            zoom("out");

          break;

        }//end switch

      }//end run_contents

      var reset_canvas = function()
      {

        drawData = "true";
        var drawString_ary = initial_view.split(",");
        data_w = drawString_ary[9];
        data_h = drawString_ary[10];

        img_url = drawString_ary[0];
        src_x = drawString_ary[1];
        src_y = drawString_ary[2];
        img_w = drawString_ary[3];
        img_h = drawString_ary[4];
        can_x = drawString_ary[5];
        can_y = drawString_ary[6];
        can_w = drawString_ary[7];
        can_h = drawString_ary[8];


          /*
                src_x = 0;
                src_y = 0;
                img_w = 500;
                img_h = 500;
                can_x = 0;
                can_y = 0;
                can_w = canvas_width;
                can_h = canvas_width;
                //canvas.width = canvas.width;
          */


            //create_canvas(obj_els["edit_home_id"]);
            current_state = "initial";
            control_panel();
            //draw it
            draw_me();

      }//end reset_canvas

      //html5 slider research
      //https://codepen.io/collection/DgYaMj/2/
      //http://thenewcode.com/757/Playing-With-The-HTML5-range-Slider-Input
      //http://danielstern.ca/range.css/#/
      //http://www.cssportal.com/style-input-range/


      var add_slider_input = function(nbr)
      {
        var home = document.getElementsByClassName("edit_slider_cont")[0];
        home.innerHTML = "";

        			//reset slide input
			sli_ctrl_inputA = "";
			sli_ctrl_inputB = "";

        var styleA = (nbr == 0 || nbr == 1) ? "goofy" : "default";//may need to make this different with html range slider
        var styleB = (nbr == 0 || nbr == 1) ? "default" : "goofy";//reverse for html slider
        var my_limit = (nbr == 0 || nbr == 1) ? slide_limit: canvas_width;//

        //SLIDER A
          var sli_ctrl_contA = document.createElement("div");
          sli_ctrl_contA.id = "sli_ctrl_contA";
          sli_ctrl_contA.className = "sli_ctrl_contA";//

            //input
            /*
              var sli_ctrl_inputA = document.createElement("input");
              sli_ctrl_inputA.id = "sli_ctrl_inputA";
              sli_ctrl_inputA.className = "sli_ctrl_inputA";//
              sli_ctrl_inputA.setAttribute("data-slider-id","sli_ctrl_inputA");//
              sli_ctrl_inputA.setAttribute("data-slider-min","-" + my_limit);//
              sli_ctrl_inputA.setAttribute("data-slider-max",my_limit);//
              sli_ctrl_inputA.setAttribute("data-slider-step","1");//
              var set_valA = slide_data("A",nbr);
              var goof_A = set_valA * -1;//natural opposite effect
              var ctrl_valA = (style == "goofy") ? goof_A : set_valA;
              sli_ctrl_inputA.setAttribute("data-slider-value", ctrl_valA);//
              //sli_ctrl_inputA.setAttribute("data-slider-handle","custom");//ninja stars section
              sli_ctrl_inputA.type = "text";
              sli_ctrl_inputA.onfocus = function(){this.select();}
              */

              sli_ctrl_inputA = document.createElement("input");
              sli_ctrl_inputA.id = "sli_ctrl_inputA";
              sli_ctrl_inputA.className = "sli_ctrl_inputA sli_ctrl_input slider";
              sli_ctrl_inputA.name = "sli_ctrl_inputA";
              //sli_ctrl_inputA.dataset.type = "range";
              sli_ctrl_inputA.type = "range";
              sli_ctrl_inputA.setAttribute("min","-" + my_limit);
              //max changes depending on user access
              //verified server side
              //entered range number can't be greater than db record of your max access
              sli_ctrl_inputA.setAttribute("max",my_limit);
              var set_valA = slide_data("A",nbr);
              var goof_A = set_valA * -1;//natural opposite effect
              var ctrl_valA = (styleA == "goofy") ? goof_A : set_valA;
              sli_ctrl_inputA.setAttribute("value",ctrl_valA);

          sli_ctrl_contA.appendChild(sli_ctrl_inputA);//

              //A onchange function below


              var sli_ctrl_boxA = document.createElement("input");
              sli_ctrl_boxA.id = "sli_ctrl_boxA";
              sli_ctrl_boxA.className = " sli_ctrl_boxA";//
              sli_ctrl_boxA.value = set_valA;//src_x;
              sli_ctrl_boxA.type = "number";
              sli_ctrl_boxA.onfocus = function(){this.select(); }

              sli_ctrl_boxA.oninput = function(){
              sli_ctrl_inputA.value = sli_ctrl_boxA.value;
                slide_data("A",nbr,{"value" :	sli_ctrl_boxA.value, "val_oper": "add"});
                //src_x = sli_ctrl_inputA.value;
                sliderA.setValue();
                draw_me();
              }//end on oninput



            //sli_ctrl_contA.appendChild(sli_ctrl_boxA);

        //END SLIDER A

        //SLIDER B
          var sli_ctrl_contB = document.createElement("div");
          sli_ctrl_contB.id = "sli_ctrl_contB";
          sli_ctrl_contB.className = "sli_ctrl_contB";

            //input
            /*
              var sli_ctrl_inputB = document.createElement("input");
              sli_ctrl_inputB.id = "sli_ctrl_inputB";
              sli_ctrl_inputB.className = "sli_ctrl_inputB";//
              sli_ctrl_inputB.setAttribute("data-slider-id","sli_ctrl_inputB");//
              sli_ctrl_inputB.setAttribute("data-slider-min","-" + my_limit);
              sli_ctrl_inputB.setAttribute("data-slider-max",my_limit);//
              sli_ctrl_inputB.setAttribute("data-slider-step","1");//
              var set_valB = slide_data("B",nbr);
              var goof_B = set_valB * -1;//natural opposite effect
              var ctrl_valB = (style == "goofy") ? goof_B : set_valB;
              sli_ctrl_inputB.setAttribute("data-slider-value",ctrl_valB);
              sli_ctrl_inputB.setAttribute("data-slider-orientation","vertical");
              //sli_ctrl_inputB.setAttribute("data-slider-handle","custom");//ninja stars section
              sli_ctrl_inputB.type = "text";
              sli_ctrl_inputB.onfocus = function(){this.select();}
              */


              sli_ctrl_inputB = document.createElement("input");
              sli_ctrl_inputB.id = "sli_ctrl_inputB";
              sli_ctrl_inputB.className = "sli_ctrl_inputB sli_ctrl_input slider";
              sli_ctrl_inputB.name = "sli_ctrl_inputB";
              //sli_ctrl_inputB.dataset.type = "range";
              sli_ctrl_inputB.type = "range";
              sli_ctrl_inputB.setAttribute("min","-" + my_limit);
              //max changes depending on user access
              //verified server side
              //entered range number can't be greater than db record of your max access
              sli_ctrl_inputB.setAttribute("max",my_limit);
              var set_valB = slide_data("B",nbr);
              var goof_B = set_valB * -1;//natural opposite effect
              var ctrl_valB = (styleB == "goofy") ? goof_B : set_valB;
              sli_ctrl_inputB.setAttribute("value",ctrl_valB);

          sli_ctrl_contB.appendChild(sli_ctrl_inputB);


              //console.info("sli_ctrl_inputB");//
              //console.dir(sli_ctrl_inputB);

              var sli_ctrl_boxB = document.createElement("input");
              sli_ctrl_boxB.id = "sli_ctrl_boxB";
              sli_ctrl_boxB.className = "sli_ctrl_boxB";//
              sli_ctrl_boxB.value = set_valB;//src_y;
              sli_ctrl_boxB.type = "number";
              sli_ctrl_boxB.onfocus = function(){this.select(); }

              //boxB input event
              sli_ctrl_boxB.oninput = function(){
                sli_ctrl_inputB.value = sli_ctrl_boxB.value;
                slide_data("B",nbr,{"value" : 	sli_ctrl_boxB.value, "val_oper": "add"});
                //src_y = sli_ctrl_inputB.value;
                sliderB.setValue();
                draw_me();
              }//end on oninput



            //sli_ctrl_contB.appendChild(sli_ctrl_boxB);

        home.appendChild(sli_ctrl_contA);
        home.appendChild(sli_ctrl_contB);

        /*
        var sliderA = new Slider('#sli_ctrl_inputA', {
          formatter: function(value) {
            return 'Current value: ' + value;
          }
        });//end new slider script

        console.info("sliderA");
        console.dir(sliderA);
        //http://seiyria.com/bootstrap-slider/

        var sliderB = new Slider('#sli_ctrl_inputB', {
          formatter: function(value) {
            return 'Current value: ' + value;
          }
        });//end new slider script
        */

        //$('input').slider();//calls both sliders
        //$('#sli_ctrl_inputA').slider();//
        //$("#lat_slider").on('change',function(){slideUpdate({'mode':gEd_mode,'dir':'lattitude'});});
        //$("#lon_slider").on('change',function(){slideUpdate({'mode':gEd_mode,'dir':'longitude'});});


            //$("#sli_ctrl_contB").on('change',function(){
            sli_ctrl_inputB.oninput = function(e){
              //console.log("slider B = ",sli_ctrl_inputB.value);
						image_update({"ltr":"B", "nbr":nbr, "style":styleB, "mode":"motion", "slide_el":sli_ctrl_inputB, "box_el":sli_ctrl_boxB});

            };//end on blur

            //A onchange function
            //$("#sli_ctrl_contA").on('change',function(){
            sli_ctrl_inputA.oninput = function(){
            //console.log("slider A = ",sli_ctrl_inputA.value);
						image_update({"ltr":"A", "nbr":nbr, "style":styleA, "mode":"motion", "slide_el":sli_ctrl_inputA, "box_el":sli_ctrl_boxA});

            };//end on blur//
        //http://seiyria.com/bootstrap-slider/

        //END SLIDER B

						canvas_mouse_events("set");

						canvas.onmouseover = function(e)
						{
							//
							canvas_mouse_events("set");

							window.onmousemove = function(e)
							{
								move_my_image(e);
							}//end canvas mousemove

            }//on mouse over

            //mouse has 4 events (mO,mD, mU, mM) touch only has 3 (tS,tE,tM)
            //so i had to do more with less - it was pretty straight forward after that.

            canvas.ontouchstart = function(e)
            {
              touchdown = true;
              e.preventDefault();
							get_touch_offset(e)
							canvas_mouse_events("set");
              //alert("touch started");

              canvas.ontouchmove = function(e)
							{
                //alert("move started");
								move_my_image(e);
							}//end canvas mousemove

            }//end ontouchstart

       //i put this in a separate function so i can use it for touch and mouse
       //canvas events
       var move_my_image = function(e)
      {
        //console.log(e);
								if(mousedown == true || touchdown == true)
								{
                  //alert("im goin in");
                //stops the mouse from hightlighting everyting on the page
								//e.preventDefault();
                  var motion_method = (mousedown == true) ? "mouse" : (touchdown == true) ? "touch" : "error";
									//e.clientX,Y = mouse position in the browser window
									var y = (mousedown == true) ? e.clientY : e.touches[0].clientY;//this number is a large # like 400 or 600
									var x = (motion_method == "mouse") ? e.clientX : e.touches[0].clientX;
									var pos = (motion_method == "mouse") ? getMousePos(e) : getTouchPos(e);
									var pos_x = pos.x; //converts to a small number like 37
									var pos_y = pos.y;

                  //if(motion_method == "touch"){alert("pos_x = " + pos_x + ", pos_y = " + pos_y
                 // + ", x = " + x + ", y = " + y)}


									if(last_x != "default" && last_x != x)
									{
										//i use "default" initially so i can tell if the object
										//ever moved at all, if never used i set it in the else

										if(x < last_x)
										{
											//then its going right
											//this if helps me determine which way the mouse is moving

											//console.log("x is less");
											//calculate how far away the new mouse position is from the
											//last mouse position
											//var new_x = last_x - x;
											//console.log("new_x = ",new_x);
											//var cur_val_x = parseInt(sli_ctrl_inputA.value);
											//sli_ctrl_inputA.value = cur_val_x -  new_x //pos_x;//cur_val_x - 50;

											//what i need is to calculate how far img is from the
											//point of origin basically the img_last_x  then i need to
											//calculate how far the mouse is from that position and
											//use it as an offset.


											var cur_val_x = parseInt(sli_ctrl_inputA.value,10);
											var new_x = pos_x + offset_x;
											//console.log("new_x = ",new_x);
                      //console.log("styleA = ",styleA);
											//sli_ctrl_inputA.value = new_x;



										}else
										{
											//if it uses this section then its going left
											//console.log("x is more");
											//var new_x = x - last_x;
											//console.log("new_x = ",new_x);
											//var cur_val_x = parseInt(sli_ctrl_inputA.value);
											//sli_ctrl_inputA.value = cur_val_x + new_x//pos_x//cur_val_x + 50;

											var cur_val_x = parseInt(sli_ctrl_inputA.value,10);
											var new_x = pos_x + offset_x;
											//console.log("new_x = ",new_x);
                      //console.log("styleA = ",styleA);
											//sli_ctrl_inputA.value =  new_x;

										}//end else x
										//console.log("new x val= ",sli_ctrl_inputA.value);
										if(nbr == 0)
										{
											sli_ctrl_inputA.value =  new_x;
											image_update({"ltr":"A", "nbr":nbr, "style":styleA, "mode":"motion", "slide_el":sli_ctrl_inputA, "box_el":sli_ctrl_boxA});//
										}else
										{
											src_x = new_x * -1;
											draw_me();
										}//end else


									}//end if last_x

									if(last_y != "default")
									{
										//what is important here is whether im above
										//or below the origin

										if(y < last_y && last_y != y)
										{
											//then its going up
											//console.log("y is less");
											//var new_y = last_y - y;
											//console.log("new_y = ",new_y);
											//var cur_val_y = parseInt(sli_ctrl_inputB.value);
											//sli_ctrl_inputB.value = cur_val_y - new_y//pos_y//poscur_val_y - 50;

											//then its going up
											var new_y = pos_y + offset_y;

											//console.log("mm pos_y = ",pos_y);
											//console.log("mm new_y = ",new_y);
											//console.log("mm offset_y = ",offset_y);

											//sli_ctrl_inputB.value = new_y;

										}else
										{
											//console.log("y is more");
											//var new_y =  y - last_y;
											//console.log("new_y = ",new_y);
											//var cur_val_y = parseInt(sli_ctrl_inputB.value);
											//sli_ctrl_inputB.value = cur_val_y + new_y//pos_y//cur_val_y + 50;
											//then its going up
											//console.log("y is less");

											//var cur_val_y = parseInt(sli_ctrl_inputB.value);
											//var new_y = pos_y - cur_val_y;
											var new_y = pos_y + offset_y;

											//console.log("mm pos_y = ",pos_y);
											//console.log("mm new_y = ",new_y);
											//console.log("mm offset_y = ",offset_y);

											//sli_ctrl_inputB.value = new_y;

										}//end else x



										//console.log("new input value = ",sli_ctrl_inputB.value);
										if(nbr == 0)
										{
											sli_ctrl_inputB.value = new_y  * -1;
											image_update({"ltr":"B", "nbr":nbr, "style":styleB, "mode":"motion", "slide_el":sli_ctrl_inputB, "box_el":sli_ctrl_boxB});
										}else
										{
											//using this without modification creates
											//and opposite effect during moving.
											//src_y = new_y;

											//modify with new_y * -1
											src_y = new_y * -1;

											draw_me();
										}//end else
									}


									// i use this the clear the default word and to set the
									//last move for each subsequent mousemove after it runs the
									//above processes
									last_x = x;
									last_y = y;
									//console.log("mouse-x = ",x);
									//console.log("last_x = ",last_x);
									//console.log("pos_x = ",pos_x);
									//console.log("pos_y = ",pos_y);

								}else
								{
									//clear the tracker
									//last_x = "";
									//last_y = "";
								}
								//end if

        }//end move my image


      }//end add_slider_input


    function getTouchPos(e) {
      var rect = canvas.getBoundingClientRect();
      //alert("touch x = " + e.touches[0].clientX);
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }


    var getMousePos = function(e) {

			//this section returns the mouse position minus the
			//canvas' top or left window position. "rect"

			var canvas_el = document.getElementById("tutorial");
			var rect = canvas.getBoundingClientRect();

			//console.log("rect.left" + rect.left);

			return {
				x: (e.clientX - rect.left) ,
				y: (e.clientY - rect.top)
			};

		}//- canvas_size/2  - canvas_size/2

		var canvas_mouse_events = function(aVar,cId)
		{

			//this function adds and removes events that affects the canvas
			//once you are outside of the canvas and you let the mouse up
			//this is designed to clear these mouse events from the memory so
			//no event occurs again until you are "mouseover"'d the canvans where
			//which will set up these events again.
			var action = aVar || "remove";
			var canvas_id = cId;
			var canvas_el = document.getElementById(cId);

			if(action == "set"){

						canvas.onmousedown = function(e){
							mousedown = true;
              e.preventDefault();
							var d = new Date();
							//console.log("onmousedown mousedown = ",mousedown);
							//console.log("time = ",d.toLocaleString());
							var pos = getMousePos(e)
							var pos_x = pos.x;
							var pos_y = pos.y;
							//x is dealing with different values so
							//the math is addition not subtraction

							//this offset number has to be
							//permanent not recalculating so it
							//doesn't migrate to another position

							//pos_x - src_x; & pos_y - src_y; produced errant results
							//pos_x/y is always negative - you cant click on other
							//side of origin - so to properly calculate the offset
							//change mouse position read out from the positive int
							//representing the amount of canvas points from the
							//origin to a more accurate negative number representing
							//the actual canvas position
							var act_x = (pos_x * -1);
							var act_y = (pos_y * -1);

							offset_x = act_x - src_x;

							offset_y = act_y - src_y;

							canvas_mouse_events("set");
						}//end onmousedown


            window.onmouseup = function()
            {
              mousedown = false;

            }//end onmousedown

            window.ontouchend = function()
            {
              touchdown = false;

            }//end ontouchend


			}else
      {
						mousedown = false;
						canvas.onmousedown = "";
						canvas.onmousemove = "";

            touchdown = false;//
            canvas.ontouchstart = "";
            canvas.ontouchmove = "";

			}//end else
		}//end canvas_mouse_events

    var get_touch_offset = function(e)
    {
        var d = new Date();
							//console.log("onmousedown mousedown = ",mousedown);
							//console.log("time = ",d.toLocaleString());
							var pos = getTouchPos(e);
							var pos_x = pos.x;
							var pos_y = pos.y;

							var act_x = (pos_x * -1);
							var act_y = (pos_y * -1);

							offset_x = act_x - src_x;

							offset_y = act_y - src_y;
              //alert(" offset_x & y = " + offset_x + "\n " + offset_y);

      }//end get touch offset

      var image_update = function(mObj){
			//console.info("image update running");

			var style = mObj.style;
			var ltr = mObj.ltr;

			var nbr = mObj.nbr;
			var mode = mObj.mode;//"motion" or not ("input" as other)

			var slide_el = mObj.slide_el;
			var box_el = mObj.box_el;

			var target_el = (mode == "motion") ? slide_el : box_el;

			if(mode == "motion")
			{
				//make regular and goofy foot (opposite) values
				var val_regular_input =  target_el.value;
				var val_goof_input = target_el.value * -1;
				var input_val = (style == "goofy") ? val_goof_input : val_regular_input;
				box_el.value = input_val;//unique to motion
			}else
			{
				if(ltr = "A"){
					sli_ctrl_inputA.value = box_el.value;
				}else{
					sli_ctrl_inputB.value = box_el.value;
				}

				var input_val = box_el.value;
				//slide_data("B",nbr,{"value" : 	sli_ctrl_boxB.value, "val_oper": "add"});
				//src_y = sli_ctrl_inputB.value;

			}

			slide_data(ltr,nbr,{"value" :	input_val, "val_oper": "add"});


			if(mode == "input"){
				if(ltr == "A")
				{
					//make these "object properties"
					sliderA.setValue();//unique to input
				}else
				{
					sliderB.setValue();//unique to input
				}
			}//end if mode ==  input

			draw_me();

		}//end image_update

      var slide_data = function(ltr,nbr,obj)
      {
        //span_set2 view_span span3 view_span3
        var slide_ltr = ltr;
        var nbr = nbr;
        var val = (obj != undefined && obj.value != undefined) ? obj.value : "";
        var val_oper = (obj != undefined && obj.val_oper != undefined) ? obj.val_oper : "get_value";

        var slide_id = ltr+nbr;
        var span_id_str = "span" + slide_id;
        var targetSpan = document.getElementById(span_id_str);

        if(val != "" && val_oper == "add" || val_oper == "both"){
          //A covers x and width
          //B covers y and height
          switch(slide_id)
          {
              case "A0":
                  src_x = val;
                  //targetSpan.innerText = val;
              break;
              case "B0":
                  src_y = val;
                  //targetSpan.innerText = val;
              break;

              case "A1":
                  img_w = val;
                  //targetSpan.innerText = val;
              break;
              case "B1":
                  img_h = val;
                  //targetSpan.innerText = val;
              break;

              case "A2":
                  can_x = val;
                  //targetSpan.innerText = val;
              break;
              case "B2":
                  can_y = val;
                  //targetSpan.innerText = val;
              break;

              case "A3":
                  can_w = val;
                  //targetSpan.innerText = val;
              break;
              case "B3":
                  can_h = val;
                  //targetSpan.innerText = val;
              break;
          }//end switch
        }//end if

        if(val_oper == "get_value" || val_oper == "both"){
          switch(slide_id)
          {
              case "A0":
                return src_x;
              break;
              case "B0":
                return src_y;
              break;
              case "A1":
                  return img_w;
              break;
              case "B1":
                  return img_h;
              break;
              case "A2":
                return can_x;
              break;
              case "B2":
                return can_y;
              break;

              case "A3":
                return can_w;
              break;
              case "B3":
                return can_h;
              break;
          }//end switch
        }//end if

      }//end slide_dataA


  /*

    //this.draw_me = function(){ draw_me();  };
  */


  }//end masterImage

//use this area to run scripts
/*
window.onload = function(){
  //var img_url = "https://cgi.chevrolet.com/mmgprod-us/dynres/prove/image.gen?i=2017/1YZ07/1YZ07__2LZ/GBA_gmds1.jpg&v=deg04&std=true&country=US&send404=true";

  var img_url = "https://lh5.googleusercontent.com/O6xOEYV1QnMBTShuvZpvmv-giqtXeXKioZcrErPxjKKVF4xrbME87iQZpTSa6tUBEOTwDsz3dIE=w1200-h630-p";

  //var img_url = "https://static6.businessinsider.com/image/55f041449dd7cc17008b8fd4-3264-2448/img_2686%20(1).jpg";

 // var img_url = "https://static.stereogum.com/uploads/2013/08/lauryn-hill.jpg";

  var edit_img = new masterImage({'home':'fish_content','url':img_url,'type':"profile",'mode':"edit"});
  edit_img.setCustomClass("edit_img");
  edit_img.display();
}//end onload

//NOTE i may not need this. #remove?
function set_dimensions()
{
  //console.log(document.body.clientHeight);
  var c_width = document.body.clientWidth;
  console.log(document.body.clientWidth);

  var canvas_el = document.getElementById("tutorial");
  var ctrl_el = document.getElementById("info_cont");
  //
  var dyn_var = (document.body.clientWidth > 499) ? 2.7 : 1.2;
  var w_calc = parseInt(c_width) / dyn_var;
  //console.log(w_calc/10);//
  canvas_el.style.height = w_calc + "px";

  //ctrl_el.style.height = w_calc + "px";
}//end set_dimensions

//set_dimensions();
*/
