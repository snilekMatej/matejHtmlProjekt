function Animation(name, id, next, miny, maxy, pic, cur, md)
{
this.name=name;
this.id=id;
this.next=next;
this.miny=miny;
this.maxy=maxy;
this.pic=pic;
this.cur=cur;
this.movingDown=md;
this.runIt=true;
};

animations=new Array();

function addAnimation(name, id, next, miny, maxy, pic, cur, md)
{
  var newix = animations.length;
  animations[newix] = new Animation(name, id, next, miny, maxy, pic, cur, md);
  for (i=0; i<newix; i++)
  {
    if (animations[i].id==id)
    {
      animations[newix].runIt = false; // there is another animation already added for this id
      break;
    }
  }
}

/* HTML CODE SHOULD CONTAIN CODE LIKE
addAnimation("myFredAnimation","fred", "fred2", 0, -100,
         new Array("images/fred1.png", 200, 10, "images/fred2.png", 300, 0),
         0, true );
*/

function nextAnimationIx(anim)
{
  for (i=0; i<animations.length; i++)
  {
    if (animations[i].name==anim.next)
    {
      return i;
    }
  }
  return -1;
}

var animationsState = new Array();
function animate(animIx)
{
  var anim = animations[animIx];
  var animCount = anim.pic.length / 3;
  anim.cur = (anim.cur+1) % animCount;
  var timeout = anim.pic[3*anim.cur+1];
  var movePx = anim.pic[3*anim.cur+2];
  var ele = document.getElementById(anim.id);
  ele.src = anim.pic[3*anim.cur];
  if (anim.movingDown)
  {
    var newTop = parseInt(ele.style.top) + movePx;
    var parentNodeHeight = ele.parentNode.clientHeight;
    if (newTop > parentNodeHeight+anim.maxy) 
    { 
      newTop = parentNodeHeight+anim.maxy;
      // is there another animation to continue with?
      var newIx = nextAnimationIx(anim);
      if (newIx>=0) setTimeout("animate(" + newIx + ")", timeout);
    }
    else setTimeout("animate(" + animIx + ")", timeout);
    ele.style.top = newTop + "px";
  }
  else
  {
    var newTop = parseInt(ele.style.top) - movePx;
    if (newTop < anim.miny) 
    { 
      newTop = anim.miny;
      // is there another animation to continue with?
      var newIx = nextAnimationIx(anim);
      if (newIx>=0) {
          animations[newIx].cur = 0;
          setTimeout("animate(" + newIx + ")", timeout);
      }
    }
    else setTimeout("animate(" + animIx + ")", timeout);
    ele.style.top = newTop + "px";
  }
}

var animateInitialized = false;
function initAnimations()
{
  if (!animateInitialized)
  {
    animateInitialized = true;

    for (i=0; i<animations.length; i++)
    {
      if (animations[i].runIt)
      {
        setTimeout("animate(" + i +")", animations[i].pic[1] );
      }
    }
  }
}

/*
<script type="text/javascript">initAnimations();</script>
*/
