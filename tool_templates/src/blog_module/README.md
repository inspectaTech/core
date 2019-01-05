
### function to convert pixels to rem

```
this.px_to_rem = function(nbr)
{
  //exclusive
  //get screen width
  let screen_width = document.body.clientWidth;//1124px

  //get 1% of screen width
  let view_width = boss.v_units();

  // get the unit of measurement the actual view width in px should be broken up into
  // where 1 view unit should be x pixels ex. 1.8% of 525px which would be 525 * .0185
  // or one view unit will be 9.71px
  let v_unit = screen_width * view_width;//.014;//11.24px

  //figure out rem measurement for the desired elements px height
  let px_nbr = nbr;//get the px height/width property passed in as a parameter

  let rem_nbr = px_nbr / v_unit;// how many rem view units can i fit into the px nbr?
  rem_nbr = +rem_nbr.toFixed(3);
  let meseeks = rem_nbr;

  return rem_nbr;

}//px_to_rem

//match the psmod.scss medi query data to th eview_widths  array object
/*
@media only screen and (max-width:299px)
{
  html{font-size:5.0vw !important;}
}
@media only screen and (min-width:300px) and (max-width:479px)
{
  html{ font-size:3.9vw !important;}
}
@media only screen and (min-width:480px) and (max-width:768px)
{
  html{ font-size:1.8vw !important;}
}
@media only screen and (min-width:769px) and (max-width:992px)
{
  html{ font-size:1.5vw !important;}
}
@media only screen and (min-width:993px) and (max-width:1239px)
{
  html{ font-size:1.4vw !important;}
}
@media only screen and (min-width:1240px) and (max-width:1343px)
{
  html{ font-size:1.25vw !important;}
}
@media only screen and (min-width:1344px) and (max-width:1468px)
{
  html{ font-size:1.15vw !important;}
}
@media only screen and (min-width:1469px)
{
  html{ font-size:1.0vw !important;}
}*/
this.view_widths = [
  {min:0,max:299,view:5.0},
  {min:300,max:479,view:3.9},
  {min:480,max:768,view:1.8},
  {min:769,max:992,view:1.5},
  {min:993,max:1239,view:1.4},
  {min:1240,max:1343,view:1.25},
  {min:1344,max:1468,view:1.15},
  {min:1469,view:1.0}
];//used with v_units

this.v_units = function()
{
  let screen_width = document.body.clientWidth;
  let view_units = 0;
  let max_nbr = boss.view_widths.length -1;
  for(let i = 0; i < boss.view_widths.length; i++)
  {
    switch(i){
      case 0:
        if(screen_width >= boss.view_widths[i].min && screen_width <= boss.view_widths[i].max)
        {
          view_units = boss.view_widths[i].view;
        }
      break;
      case max_nbr:
        if(screen_width  >= boss.view_widths[i].min)
        {
          view_units = boss.view_widths[i].view;
        }
      break;
      default:
      if(screen_width >= boss.view_widths[i].min && screen_width <= boss.view_widths[i].max)
      {
        view_units = boss.view_widths[i].view;
      }
    }//switch
    //if(view_units !== 0)break;
  }
  let modifier = .0005;// the modifier tacks on an extra half percent - seems to make it a little more robust?
  view_units = (view_units / 100) + modifier;//im not sure the modifier is doing anything.
  view_units = +view_units.toFixed(5);
  let meseeks = view_units;
  return view_units;
}//v_units
```
