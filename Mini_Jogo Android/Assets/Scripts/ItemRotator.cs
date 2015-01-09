using UnityEngine;
using System.Collections;
public class ItemRotator : MonoBehaviour {
	void Update()
	{
		transform.Rotate(new Vector3(0, 50, 0) * Time.deltaTime);
	}
}