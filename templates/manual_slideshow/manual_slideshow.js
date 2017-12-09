(function(){
  var app = angular.module("pictureShow");
  app.directive("manualSlideshow",["$window",function($window){
  return{
    restrict:"C",
    templateUrl:function(elem, attr){
      let file_name = attr.marquee;
      //let urlStr = `${BASEURL}components/com_psmod/xfiles/js/${file_name}.html`;
      let urlStr = `${attr.home}templates/${file_name}/${file_name}.html`;

      console.log(`new url string = ${urlStr}`);

      return urlStr;
    },
    /*link: function(scope, element, attrs, ngModel) {
            if (
                   'undefined' !== typeof attrs.type
                && 'number' === attrs.type
                && ngModel
            ) {
                ngModel.$formatters.push(function(modelValue) {
                    return Number(modelValue);
                });

                ngModel.$parsers.push(function(viewValue) {
                    return Number(viewValue);
                });
            }
            if(element.className.indexOf("mSS_stgs_bg_option") != -1)
            {
              console.log("btn element detected");
            }//end if
        },*/
    /*template:'<div class="showTime_manual_slideshow w3-content w3-display-container pure-h" ng-if="take1.motiv == \'default\'">'
      + '<div class="showTime_img_cont pure-h" >'
        + '<div id="showTime_img_{{take1.iUN}}_{{action.id}}"'
        + 'ng-repeat="action in take1.my_stars" ng-if="take1.initiated"'
        + 'class="showTime_img pure-h  mySlides" ng-bind="take1.insertCanvas(action)">'
        + '</div>'
      + '</div>'
      + '<button class="w3-button w3-black w3-display-left" ng-click="take1.plusDivs(-1)">&#10094;</button>'
      + '<button class="w3-button w3-black w3-display-right" ng-click="take1.plusDivs(1)">&#10095;</button>'
    + '</div>'
    //+ '<div ng-if="take1.motiv == \'settings\'">switched to settings \n data params = {{take1.service.current_tool.params.data}}'
    + '<div class="mSS_stgs" ng-if="take1.motiv == \'settings\'">'
    + '<h5 class="mSS_stgs_label">manual slideshow settings</h5>'
    + '<div class="mSS_stgs_current_info mSS_stgs_content_box">'
      + '<label title="size of your current viewport (above the fold)">current screen size:</label>'
      + '<div>height:   {{take1.screen_width}}</div>'
      + '<div>width:   {{take1.screen_height}}</div>'
    + '</div><!--ends current info-->'
    + '<div class="mSS_stgs_custom_info mSS_stgs_content_box">'
      + '<label title="customize the size your slideshow should be compared to the viewport">custom size:</label>'
      + '<div class="mSS_stgs_size_wrapr"><div class="mSS_stgs_size_wrapr">width:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1.service.tool.details.width"></div>'
      + '<div class="mSS_stgs_size_wrapr"><div >height:</div><input class="mSS_stgs_custom_input" type="text" ng-model="take1.service.tool.details.height"></div>'
    + '</div><!--ends current info-->'
    + '<div class="mSS_stgs_mobility_info mSS_stgs_content_box">'
      + '<label title="should the slideshow be responsive">mobile friendly:</label>'
      + '<button type="button" class="mSS_stgs_resp first w3-btn" ng-click="take1.is_responsive(\'yes\')" '
      + 'ng-class="{active:take1.responsive == 1}">yes</button>'
      + '<button type="button" class="mSS_stgs_resp w3-btn" ng-click="take1.is_responsive(\'no\')" '
      + 'ng-class="{active:take1.responsive == 0}"  title="if set to \'no\' the slideshow will only be visible on desktops" >no</button>'
    + '</div><!--ends current info-->'
    + '</div>',*/
    /*
    + '<div>'
    + '</div>'
    */
    scope: {
      marquee: '@',
      cast: '@',
      home: '@',
      motiv: '@',
      sttngs: '=',
      mode: '@',
      stage: '@'
    },
    link: function(scope, element, attrs){

      if(attrs.mode != "admin") return;

      angular.element($window).bind('resize', function(){
        //bugfix - the element passed here doesn't always have a controller but the scope seems constant
        let my_scope = scope;
        //let el_ctrlr = element.controller();//bug: doesn't always have a controller
        let el_ctrlr = scope.take1;//fixed
          el_ctrlr.service.screen_width = document.body.clientWidth;
          //el_ctrlr.service.screen_width = document.querySelector(el_ctrlr.front_stage).parentNode.clientWidth;
          //console.log("clientWidth = ",document.body.clientWidth);
          el_ctrlr.service.screen_height = document.body.clientHeight;
          //el_ctrlr.service.screen_height = document.querySelector(el_ctrlr.front_stage).parentNode.clientHeight;
          //console.log("clientHeight = ",document.body.clientHeight);
          el_ctrlr.refresh();
      });

    },
    controller:["ShowData","$sce","$scope","$timeout",function(ShowData,$sce,$scope,$timeout){

      var boss = this;
      this.service = ShowData;
      this.object_params = [];
      this.object_elements = {};
      this.initiated = false;//helps to delay calling elements b4 template is ready
      this.screen_width = ShowData.screen_width;
      this.screen_height = ShowData.screen_height;
      this.responsive = 1;
      this.background = "";
      this.section = "basic";
      this.option_section = "options";
      this.front_stage = "";


      console.log("stars = ",this.stars);

      var iUN = Math.round(Math.random() * 10000);
      this.iUN = iUN;

      $scope.$watch(function(){return boss.service.asset_info}, function (newValue, oldValue, scope) {
        //Do anything with $scope.letters
        //console.log("newValue = ",newValue);
        //console.log("oldValue = ",oldValue);
        if (newValue && boss.initiated == true)
          //boss.my_stars = newValue;
        boss.my_stars = newValue;//i think this is an array of all the asset content associated with this tool
        console.log("i see a change in my_stars = ",boss.my_stars);

      }, true);

      $scope.$watch(function(){return boss.service.screen_width}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_width = newValue;
        if(boss.initiated == true)
        {
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_width = ",boss.screen_width);
      }, true);
      $scope.$watch(function(){return boss.service.screen_height}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.screen_height = newValue;
        if(boss.initiated == true)
        {
          boss.process_size();
        }//end if
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);


      $scope.$watch(function(){return boss.service.tool.details.custom_class}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.cast = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      //do i need this $watch?
      $scope.$watch(function(){return boss.service.tool.details.sample_class}, function (newValue, oldValue, scope) {
        if (newValue){
          //boss.my_stars = newValue;
        //boss.alternate = newValue;
        }
        //console.log("i see a change in screen_height = ",boss.screen_height);
      }, true);

      $scope.$watch(function(){return boss.service.tool}, function (newValue, oldValue, scope) {
        if (newValue)
          //boss.my_stars = newValue;
        boss.tool = newValue;
        //console.log("i see a change in screen_height = ",boss.screen_height);
          boss.process_size();

      }, true);


      //console.log("select array = ",this.selectArray)
      this.$onInit = function() {
        //boss.my_stars = boss.stars;
        //console.log(this);
        boss.service.screen_width = document.body.clientWidth;
        boss.service.screen_height = document.body.clientHeight;
        //let venue = document.querySelector(boss.front_stage).parentNode;
        //boss.service.screen_width = venue.clientWidth;
        //boss.service.screen_height = venue.clientHeight;//probably won't have dimensions till i fill it?

        if(Object.keys(ShowData.tool).length !== 0 && ShowData.tool.constructor === Object)
        {
          //if the object isn't empty do this
          console.log("tool width is ",ShowData.tool.details.width);
          if(ShowData.tool.details.width == "default"){
            ShowData.tool.details.width = document.body.clientWidth * .80;
            //ShowData.tool.details.width = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
          }


          let banner_ratio = 8/3;
          if(ShowData.tool.details.height == "default"){
            ShowData.tool.details.height = Math.ceil(ShowData.tool.details.width / banner_ratio);
          }
        }
        $timeout(function(){
           //console.log("post Digest with $timeout");
           boss.initiated = true;
           //boss.my_stars = boss.update_assets(ShowData.asset_ids);
           boss.my_stars = ShowData.asset_info;//from
           //if(boss.my_stars.length == 0){  boss.orbital_style();}
        },0,true).then(function(){
           //boss.showDivs(slideIndex);
           //late watch
           $scope.$watch(function(){return boss.service.tool.details.width}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(newValue == "default"){
                 ShowData.tool.details.width = document.body.clientWidth * .95;
                 //ShowData.tool.details.width = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //if(boss.my_stars.length == 0 && boss.initiated == true){boss.orbital_style();}
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss.service.tool.details.height}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
               if(newValue == "default"){
                 let c_Ht = document.body.clientWidth * .95;
                 //let c_Ht = document.querySelector(boss.front_stage).parentNode.clientWidth * .95;
                 //why 2.666? i guess im going to automatically make the default a banner style
                 ShowData.tool.details.height = Math.ceil(c_Ht/2.66666);
               }
             //console.log("i see a change in screen_height = ",boss.screen_height);
           }, true);

           $scope.$watch(function(){return boss.service.tool.details.responsive}, function (newValue, oldValue, scope) {
             if (newValue)
               //boss.my_stars = newValue;
             boss.responsive = newValue;
             //console.log("i see a change in responsive = ",boss.responsive);
           }, true);


        });//end .then() of $timeout
      };

      this.update_assets = function(dIDs)
      {
        let comp_ids = [];
        dIDs.forEach(function(entry){
          if(ShowData.asset_reference[entry] != undefined){
            comp_ids.push(ShowData.asset_reference[entry]);
          }//end if
        });
        return comp_ids;
      }

      this.insertCanvas = function(dt,lst)
      {
        var inObj = dt;
        let restrict_id = "canvas_img_" + iUN + "_" + inObj.id;
        if(document.querySelector("." + restrict_id) && ShowData.refresh_tool == "false") return;

        let obj_params = JSON.parse(inObj.params);

        let params_str = "params" + inObj.id;
        let last_el = lst;

        // i didn't want to do numbers and create gap indexes so i used a multidim array
        boss.object_params[params_str] = obj_params;
        let obj_str = "canvas_" + iUN + "_"  + inObj.id;
        let asset_id = "showTime_img_" + iUN + "_" + inObj.id;
        let addClass = " " + restrict_id + " arc_rich_img prev_img asset darken ";//d3-w80 d3-h30
        boss.canvas_mkr({name:obj_str,params:obj_params,home:asset_id,class:addClass,adjust:true});

        console.log("asset_id = ",asset_id);

        if(ShowData.refresh_tool != "false" && last_el == true){
          //if its the last one reset the container & tell it to close;

          boss.orbital_style();

          ShowData.refresh_tool = "close";
        }//end if boss
        //console.log("insert data = ",dt);
      }//insertCanvas

      this.orbital_style = function(){
        //this section is designed to style the directive container
        //let queryStr = ".manual-slideshow.tool_default";
        let queryStr = boss.stage;
        queryStr = "." + ShowData.removeSomething(queryStr,' ');
        let boss_cont = document.querySelector(queryStr);
        let chk_str = boss_cont.className;
        let scrap = boss.weedOut(chk_str,["d3_","d3S_","d3M_","d3L_","d3XL_"],queryStr);

        let use_class = (boss.mode == "admin") ? ShowData.tool.details.sample_class: ShowData.tool.details.custom_class;

        let newClass = boss_cont.className + " " + use_class + " ";

        boss_cont.className = ShowData.removeSomething(newClass,' ');
      }//orbital_style

      this.getClass = function()
      {
        let use_class = (boss.mode == "admin") ? ShowData.tool.details.sample_class: ShowData.tool.details.custom_class;
        return use_class;
      }//getClass

      this.weedOut = function(str,srch,qSel)
      {
        let targ_str = str;
        let targ_ary = str.split(" ");
        let weedAry = [];
        let srch_ary = (typeof srch == "string") ? [srch] : srch;
        let scratchy = (qSel != undefined) ? document.querySelector(qSel) : "default";

        srch_ary.forEach(function(sentry)
        {
          targ_ary.forEach(function(entry)
          {
            if(entry.indexOf(sentry) != -1)
            {
              weedAry.push(entry);
              if(scratchy != "default"){
                scratchy.className = scratchy.className.replace(entry,"");
              }//end if
            }
          });
        });

        //when im done clean it up
        if(scratchy != "default"){
          scratchy.className = ShowData.removeSomething(scratchy.className,' ');
        }//end if
        return weedAry;
      }//weedOut


      this.canvas_mkr = function(cObj)
      {
        //cObj.restrict != undefined to prevent error on undefined property
        if(cObj.restrict != undefined && document.querySelector("." + cObj.restrict) && ShowData.refresh_tool == "false" ) return;

        //if home doesn't exist go back
        let check_home = (document.getElementById(cObj.home)) ? document.getElementById(cObj.home) : document.getElementsByClassName(cObj.home)[0];
        if(check_home == undefined)return;

        let can_home = cObj.home;
        let crew_obj = ShowData.tool;//JSON.parse(unescape(boss.crew));
        let can_params = cObj.params;
        let can_custom_class = cObj.class || "";
        let can_url = can_params.url;
        let can_w = (can_params.canvas != undefined && can_params.canvas.width != "")
        ? can_params.canvas.width : ShowData.canvas.landscape.w;
        let can_h = (can_params.canvas != undefined && can_params.canvas.height != "")
        ? can_params.canvas.height : ShowData.canvas.landscape.h;
        let can_restrict = cObj.restrict || "";
        let can_class = cObj.class || "";
        can_class += " " + can_restrict + " ";
        console.log("crew styles = ",crew_obj.details.custom_class);
        //can_class += " " + crew_obj.details.custom_class + " ";
        let use_class = (boss.mode == "admin") ? crew_obj.details.sample_class : crew_obj.details.custom_class ;
        can_class += " " + use_class + " ";
        can_class = ShowData.removeSomething(can_class,' ');
        let can_name = cObj.name;//variable name
        let adjust = cObj.adjust || false;

        if(adjust != false){
          can_class += (parseInt(can_w) <= parseInt(can_h)) ? " portrait " : "";
        }//end if

        boss.object_elements[can_name] = new masterImage({home:can_home,varName:can_name,url:can_url,type:"banner",
        width:can_w,height:can_h});//looks like this controls the resolution
    		boss.object_elements[can_name].setCustomClass(can_class);
        boss.object_elements[can_name].setRawDisplay();
        if(can_params.img_obj.canvas_data != undefined && can_params.img_obj.canvas_data != "" && can_params.img_obj.canvas_data != {})
        {
          boss.object_elements[can_name].setView(can_params.img_obj.canvas_data);
        }
        //boss.object_elements[can_name].setFitDisplay();
        boss.object_elements[can_name].clearHome("true");
        boss.object_elements[can_name].display();

        var asset_img_array = boss.object_elements[can_name].get_event_ids();
        var asset_img_id = asset_img_array[0];


        if(ShowData.refresh_tool == "close"){
          //if i make changes this tell the program its ok to redo all the canvases
          //if i ever use canvase with the setting mode i will have to filter this with mode == default
          $timeout(function(){
             console.log("appjs Digest with $timeout");

          },0,true).then(function(){
            //console.log("loader is off");
            //ShowData.loader = 0;
            ShowData.refresh_tool = "false";

          });
        }

      }//end canvas_mkr

      var slideIndex = 1;

      this.plusDivs = function(n) {
        boss.showDivs(slideIndex += n);
      }

      this.showDivs = function(n) {
        var i;
        //let cls_str = "mySlides" + iUN;
        //let cls_str = "mySlides";
        let cls_str = "mySlides" + boss.service.module_id;//bugfix for multiple slideshows
        var x = document.getElementsByClassName(cls_str);

        if(x == undefined || x.length == 0)return;//bugfix for angular false positives

        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "block";
      }//end showDivs

      this.process_size = function()
      {
        if(boss.mode == "admin"){
          //i can use an admin mode if i need it
          //console.log("mode=",boss.mode);
          console.log("crew=",unescape(boss.crew));

          //get the sceen dimensions
          let s_w = parseInt(boss.screen_width) * .8;//* .8 gives me the size of the showcase
          let s_h = parseInt(boss.screen_height) * .8;

          //get the custom dimensions
          let c_w = ShowData.tool.details.width;
          let c_h = ShowData.tool.details.height;

          let orient = (c_w == c_h) ? "square" : (c_w > c_h) ? "landscape"  : "portrait";

          let is_responsive = boss.responsive;

          //if responsive or if <= use the responsive classes
          //process width
          if(is_responsive == 1)
          {
            //if(c_w <= s_w && c_h <= s_h ) use the ratio if its bigger than the page
            //if its bigger than the screen height - use c_h to s_h
            ShowData.tool.details.ratio = boss.get_ratio(c_w,c_h);
            let the_ratio = ShowData.tool.details.ratio.split(":");
            let w_ratio = the_ratio[0];
            let h_ratio = the_ratio[1];
            //get % of screen width

            let w_pct,h_pct;
            switch(orient)
            {
              case "square":
              w_pct = (c_w <= s_w) ? c_w / s_w : .95;
              w_pct = (w_pct > .95) ? .95 : w_pct;//make sure it doesn't exceed 95

              h_pct = w_pct;
              break;

              case "portrait":
              h_pct = (c_w <= s_w) ? c_h / s_w : c_h / c_w;
              h_pct = (h_pct > .95) ? .95 : h_pct;//make sure it doesn't exceed 95

              w_pct = h_pct / h_ratio;
              break;

              case "landscape":
                w_pct = (c_w <= s_w) ? c_w / s_w : .95;
                w_pct = (w_pct > .95) ? .95 : w_pct;//make sure it doesn't exceed 95

                h_pct = w_pct / w_ratio;
              break;
            }//switch

            let w_class = " d3S_w" + boss.rounded(w_pct);
            let h_class = "d3S_h" + boss.rounded(h_pct);


            let samp_w_class = " d3S_w" + parseInt(boss.rounded(w_pct * .80));
            let samp_h_class = "d3S_h" + parseInt(boss.rounded(h_pct  * .80));

            ShowData.tool.details.class_style = " " + w_class + " " + h_class + " ";
            ShowData.tool.details.class_alt = " " + samp_w_class + " " + samp_h_class + " ";

            let custom_class = " " + ShowData.tool.details.class_pfx + " " + ShowData.tool.details.class_style + " ";
            custom_class = ShowData.removeSomething(custom_class,' ');
            let sample_class = " " + ShowData.tool.details.class_pfx + " " + ShowData.tool.details.class_alt + " ";
            sample_class = ShowData.removeSomething(sample_class,' ');

            ShowData.tool.details.custom_class = custom_class;
            ShowData.tool.details.sample_class = sample_class;

            console.log("class style = ",ShowData.tool.details.class_style);
            console.log("class alt = ",ShowData.tool.details.class_alt);
          }//end if boss.mode
          boss.orbital_style();

          ShowData.refresh_tool = "true";
        }

      }//process_size

      this.get_ratio = function(w,h)
      {
        let ratio;
        if(w == h){
          ratio = "1:1";
        }else if(w > h){
          calc = w / h;
          ratio = calc + ":1";
        }else {
          calc = h / w;
          ratio = "1:" + calc;
        }

        return ratio;
      }//get_ratio

      this.rounded = function(nbr,mod)
      {
        //sample: boss.rounded(h_pct,"fives");//rounds to the nearest 5

        let mode = mod || "default";
        let targ = nbr * 100;
        let test_nbr;
        targ = targ.toFixed(2);
        //isolate the 1's place #
        targ_floor = Math.floor(parseInt(targ)/10) * 10;
        let e_nbr = targ - targ_floor;
        switch(mode)
        {
          case "fives":

          //i dont want to go bigger
          if(e_nbr == 5){
            //if its a 5 use the number as is
            pct = Math.floor(targ);
          }else if(e_nbr > 5){
            //if greater than 5
            test_nbr = e_nbr - 5;
            if(test_nbr >= 2.5){
              pct = targ_floor + 10;
            }else{
              pct = targ_floor + 5;
            }//end else
          }else {
            //less than 5
            test_nbr = 5 - e_nbr;
            if(test_nbr <= 2.5){
              pct = targ_floor + 5;
            }else{
              pct = targ_floor;
            }//end else
          }//end else
          break;
          default:
            pct = Math.round(targ);
          break;
        }
        console.log("pct = ",pct);
        return pct;
      }//get_ratio

      this.prep_opacity = async function()
      {
          let targ_el = event.target;

            //i need to compile the new color
            await boss.form_btn_color("opacity",targ_el.value);
            boss.form_btn_style();

      }//prep_color

      this.prep_color = async function(mod)
      {
        let targ_el = event.target;
            //i need to compile the new color
            await boss.form_btn_color(mod,targ_el.value);
            boss.form_btn_style();

        //return arguments.length ? (_name = newName) : _name;//I like this shortcut
      }//prep_color

      this.form_btn_color = function(mod,dat)
      {
        switch(mod)
        {
            case "opacity":
              let nbr = dat;//0 - 100
              let pct = parseInt(dat,10) / 100;
              let targ_nbr = (Math.floor(255 * pct)).toString(16);

              boss.service.tool.details.btn_base16 = targ_nbr;
              boss.service.tool.details.btn_hex = boss.service.tool.details.btn_bg + "" + targ_nbr;
              //boss.service.tool.details.btn_opacity = parseInt(dat,10);
            break;

            case "color":
              boss.service.tool.details.btn_hex = dat + "" + boss.service.tool.details.btn_base16;
              boss.service.tool.details.btn_bg = dat;
            break;
        }//end switch
      }//form_btn_color

      this.form_btn_style = function()
      {
        boss.service.tool.details.btn_style = "background-color:" + boss.service.tool.details.btn_hex + " !important;";
      }//form_btn_style

      this.btn_hover = function(data)
      {
        let targ_el = event.target;
        switch(data)
        {
          case "enter":

          break;

          case "leave":

          break;
        }//switch
      }//btn_hover

      this.is_responsive = function(str)
      {
        console.log("is_responsive str = ",str);
        switch(str)
        {
          case "yes":
            ShowData.tool.details.responsive = "1";
          break;
          case "no":
            ShowData.tool.details.responsive = "0";
          break;
        }//switch
      }//end is_responsive

      this.form_reset = function(fNm)
      {
        ShowData.toolData.forEach(function(entry)
        {
          if(entry.file_name == fNm)
          {
            ShowData.tool = ShowData.bboy(entry);
          }
        });
      }//form_reset


      //this has to run once everything is finished loading so i put it in $onInit
      //this.showDivs(slideIndex);


      this.refresh = function()
      {
        $scope.$digest();

      }//refresh

      this.me_seeks= function(data)
      {
        boss;
        if(data != undefined)
        {
          console.log("here comes data",data);
        }
        let tVar = data || "";
        console.log("im working",tVar);
        return true;

      }//me_seeks


    }],
    controllerAs:"take1",
    bindToController:true
  };
}]);
})();
