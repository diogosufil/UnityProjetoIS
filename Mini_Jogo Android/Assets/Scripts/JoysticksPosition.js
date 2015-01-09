#pragma strict

 public var leftJoystick : GUITexture;
 public var rightJoystick : GUITexture;
 public var size : float;
 function Start()
 {
 	 //right joystick size and position:
     rightJoystick.pixelInset.width = Screen.width * size;
     rightJoystick.pixelInset.height= Screen.width * size;
     rightJoystick.pixelInset.x = Screen.width - rightJoystick.pixelInset.width*1.5;
     
     //left joystick size:
     leftJoystick.pixelInset.width = Screen.width * size;
     leftJoystick.pixelInset.height= Screen.width * size;
     leftJoystick.pixelInset.x = leftJoystick.pixelInset.width/2;
 }