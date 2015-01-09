
#pragma strict

@script RequireComponent( CharacterController )

// This script must be attached to a GameObject that has a CharacterController
var moveTouchPad : Joystick;
var rotateTouchPad : Joystick;						// If unassigned, tilt is used

var forwardSpeed : float = 4;
var backwardSpeed : float = 1;
//var sidestepSpeed : float = 1;
var runningMultiplier : float = 3;
var jumpSpeed : float = 8;
var inAirMultiplier : float = 0.25;					// Limiter for ground speed while jumping

private var thisTransform : Transform;
private var character : CharacterController;
private var cameraVelocity : Vector3;
private var velocity : Vector3;						// Used for continuing momentum while in air
private var canJump = true;
private var isRuning = false;

function Start()
{
	// Cache component lookup at startup instead of doing this every frame		
	thisTransform = GetComponent( Transform );
	character = GetComponent( CharacterController );	
	// Move the character to the correct start position in the level, if one exists
	var spawn = GameObject.Find( "PlayerSpawn" );
	if ( spawn )
		thisTransform.position = spawn.transform.position;
}

function OnEndGame()
{
	// Disable joystick when the game ends	
	moveTouchPad.Disable();
	
	if ( rotateTouchPad )
		rotateTouchPad.Disable();	

	// Don't allow any more control changes when the game ends
	this.enabled = false;
}
function Update()
{
	var movement = thisTransform.TransformDirection( Vector3( 0, 0, moveTouchPad.position.y ) );
	var jump = false;

	// We only want horizontal movement
	movement.y = 0;
	movement.Normalize();


	// Apply movement from move joystick
	var absJoyPos = Vector2( Mathf.Abs( moveTouchPad.position.x ), Mathf.Abs( moveTouchPad.position.y ) );	
	if ( absJoyPos.y > absJoyPos.x )
	{
		if ( moveTouchPad.position.y > 0 ){
			movement *= forwardSpeed;
			//anda quando está em terra para afrente e para trás
				if(character.isGrounded){
		    		if(!isRuning){
		        		animation.Play("walk");
		    		}
		    		else if(isRuning){
		        		animation.Play("run");
						movement *= runningMultiplier;
		  			}
				}
			}
		else{
			animation.Play("idle");
			movement *= 0;
		}
        
	}
	else if( absJoyPos.x > absJoyPos.y ){
		if ( moveTouchPad.position.x > 0 ){
				this.transform.Rotate(Vector3.up,90*Time.deltaTime);
			}
		else{
				this.transform.Rotate(Vector3.down,90*Time.deltaTime);
		}
        //quando se vira para
		animation.Play("idle");
		canJump = false;
	}
	else{
	    //movement *= sidestepSpeed;
        //quando esta parado, para
		if(character.isGrounded)
			animation.Play("idle");
	}	
	// Check for jump
	if ( character.isGrounded )
	{		
		var touchPad : Joystick;
		if ( rotateTouchPad )
			touchPad = rotateTouchPad;
		else
			touchPad = moveTouchPad;
	
		if ( !touchPad.IsFingerDown() )
			canJump = true;
		//para cima para saltar
	 	if ( canJump && touchPad.position.y > 0)
	 	{
			jump = true;
			canJump = false;
	 	}	
		
		if ( jump )
		{
			// Apply the current movement to launch velocity		
			velocity = character.velocity;
			velocity.y = jumpSpeed;
            //quando salta
			animation.Play("jump_pose");
		}
        //duplo clique e pressionar ao segundo clique para correr
        if (touchPad.tapCount == 2 && touchPad.IsFingerDown())
        {
		    isRuning = true;
		}
		else
		{
		    isRuning = false;
		}
	}
	else
	{			
		// Apply gravity to our velocity to diminish it over time
		velocity.y += Physics.gravity.y * Time.deltaTime;
				
		// Adjust additional movement while in-air
		movement.x *= inAirMultiplier;
		movement.z *= inAirMultiplier;
	}
		
	movement += velocity;	
	movement += Physics.gravity;
	movement *= Time.deltaTime;
	
	// Actually move the character	
	character.Move( movement );
	
	if ( character.isGrounded )
		// Remove any persistent velocity after landing	
		velocity = Vector3.zero;
	
}