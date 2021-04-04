class Form {

  constructor() {
    this.input = createInput("Name");
    
    this.button = createButton('Play');
  }

  display(){
    this.restrict = "Name";
    this.restrict2 = "";

    if( this.input.value()!=this.restrict && this.input.value()!=this.restrict2 ){
    form.button.mousePressed(()=>{
      console.log("inside display")
      this.input.hide();
      this.button.hide();
    
      player.name = this.input.value();
      playerCount++;
      player.index = playerCount;
      gameState = PLAY;
      console.log(player.name)
      
      player.updateCount(playerCount);
      player.update()
      console.log(playerCount)
     })
    } 

    if(this.button.mousePressed){
      if( this.input.value()===this.restrict || this.input.value()===this.restrict2 ){
        fill("yellow")
        textSize(10)
        text("* Not Valid 'Enter Your Name' ",220,140)
        
      }
    }
    
    //this.title.style.color = 'yellow';
    this.input.position(displayWidth/2 - 100 , displayHeight/2 - 100);
    this.button.position(displayWidth/2 - 40, displayHeight/2-50);
2
   // this.button.mousePressed(()=>{

      
     
    //});

  }
}
