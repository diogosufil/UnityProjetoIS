using UnityEngine;
using System.Collections;
public class PickUpItems : MonoBehaviour {

	public GameObject endText;
	public int numberItems = 6;
	private int count = 0;
	private float time = 0.0f;
	private bool end = false;

	private float ultimoTouch = 0.0f;

	private void Update(){
		if (end) {
			foreach(Touch touch in Input.touches){
				if(touch.tapCount == 3){
					endText.guiText.text = "";
					Application.LoadLevel ("Start");
				}
			}
		}
	}

	private void OnTriggerEnter(Collider other)
	{
		if (other.gameObject.name == "Item")
		{
			other.gameObject.SetActive(false);
			count++;
		}
		if (count == numberItems) 
		{
			time = Mathf.Round(Time.timeSinceLevelLoad);
			endText.guiText.text = "Game Over!\nTime: " + time + " seconds\nTriple tap screen to restart game.";
			end = true;
		}
	}
}