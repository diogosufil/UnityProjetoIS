#pragma strict

function Update () {
	for(touch in Input.touches){
		if(touch.tapCount == 1)
			Application.LoadLevel("Demo");
		}
}