class Animation { 
  constructor(name, idOfImgTag, next, targetTop, pic, cur, md) {
    this.name = name;
    this.id = idOfImgTag;
    this.next = next;
    this.targetTop = targetTop;
    this.pic = pic;
    this.cur = cur;
    this.movingDown = md;
    this.animCount = pic.length / 3;
  }
  
  timeout() {
    return this.pic[3*this.cur+1];
  }

  movePx() {
    return this.pic[3*this.cur+2];
  }
  
  shiftAnim() {
    this.cur = (this.cur+1) % this.animCount;
    var ele = document.getElementById(this.id);
    ele.src = this.pic[3*this.cur];
    return parseInt(ele.style.top) + this.movePx();
  }
  
  nextAnimation() {
    return animations[this.id][this.next];
  }
  
  updateTimeout(newAnim) {
    // is there another animation to continue with?
    if (newAnim != undefined) setTimeout(function(){ newAnim.animate() }, this.timeout());
  }
}

var animations = {}

class AnimationUp extends Animation {
  constructor(name, idOfImgTag, next, targetTop, pic) {
    super(name, idOfImgTag, next, targetTop, pic, 0, false);
  }
  
  movePx() {
    return -super.movePx();
  }
  
  animate()
  {
    var newTop = this.shiftAnim();
    if (newTop < this.targetTop) 
    { 
      newTop = this.targetTop;
      this.updateTimeout(this.nextAnimation());
    }
    else this.updateTimeout(this);
    
    document.getElementById(this.id).style.top = newTop + "px";
  }
}

class AnimationDown extends Animation {
  constructor(name, idOfImgTag, next, targetTop, pic) {
    super(name, idOfImgTag, next, targetTop, pic, 0, true);
  }
  
  movePx() {
    return super.movePx();
  }
  
  animate() {
    var newTop = this.shiftAnim();
    var ele = document.getElementById(this.id);

    var parentNodeHeight = ele.parentNode.clientHeight;
    if (newTop > parentNodeHeight+this.targetTop) 
    { 
      newTop = parentNodeHeight+this.targetTop;
      this.updateTimeout(this.nextAnimation());
    }
    else this.updateTimeout(this);

    ele.style.top = newTop + "px";
  }      
}

var animations = {};

var uninitializedAnimations = [];

function addAnimation(newAnim) {
  var anim = animations[newAnim.id];
  if (anim == undefined) {
    anim = animations[newAnim.id] = {}
    uninitializedAnimations.push(newAnim);
  }
  anim[newAnim.name] = newAnim;
}

/* HTML CODE SHOULD CONTAIN CODE LIKE
     addAnimation(new AnimationUp("Nahoru","matej", "Dolu", 230,
         new Array("images/TondaA.gif", 300, 40, 
                   "images/TondaB.gif", 300, 10)));  
*/

function initAnimations()
{
  uninitializedAnimations.forEach((anim) => anim.updateTimeout(anim));
  uninitializedAnimations = [];
}

/*
<script type="text/javascript">initAnimations();</script>
*/
