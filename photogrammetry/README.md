# Intro to photogrammetry

![img](img/shining-360.png)

"Shining 360" by [Claire Hentschker](http://www.clairesophie.com/)



##### Table of Contents

[3D scan of objects](#3d-scan-of-objects)

[3D scan of ambients](#3d-scan-of-external-ambients) 

[3D scanned model elaboration.](#3d-scanned-model-elaboration)

[Space Navigation](#space-navigation)




<a name="#scan-obj"/>

## 3D scan of objects.

</a>

* Introduction to photogrammetry
* Introduction to point clouds.
* How to use [metashape](https://www.agisoft.com/) and how to import your scanned object in other programs. These tutorials refers to Agisoft photoscan, the new version of this software is called metashape, it works more or less the same. The following tutorials comes from [Golan Levin's course](https://github.com/golanlevin/ExperimentalCapture/)
    * Metashape's [documentation](https://www.agisoft.com/pdf/metashape_1_6_en.pdf). Specially the "capturing scenarios" chapter.
	* Alex Porter's Tutorial: Capturing with Photoscan](https://vimeo.com/123701711)
	* *Optional viewing*: Alex Porter's Tutorial for [Alex Porter's Tutorial: Cleaning Photoscans](https://vimeo.com/123702711)
	* [Michelle's tutorial](https://github.com/golanlevin/ExperimentalCapture/blob/master/students/michelle/tutorial2.md) for using PhotoScan
	* [Claire's tutorial](https://github.com/golanlevin/ExperimentalCapture/blob/master/workshop/pdf/photogrammetry_from_video_with_photoscan.pdf) for PhotoScan from video frames.
	* [scanning of the bottom part of an object](https://www.agisoft.com/index.php?id=49)
	* [metashape tutorial](https://styly.cc/tips/photogrammetry_discont_metashape/)

### Resources/Inspiration:
- [Sample Data](https://www.agisoft.com/downloads/sample-data/)
- [Model reconstruction](https://www.agisoft.com/pdf/PS_1.4_Tutorial%20(BL)%20-%203D%20Model%20Reconstruction.pdf)
- [A brief history of photogrammetry, By Golan Levin](https://github.com/golanlevin/ExperimentalCapture/blob/master/docs/Photogrammetry-and-3D-scanning.md)
- [Slit Scan Turntable by Convivial](https://www.instructables.com/id/Slit-Scan-Turntable/)
- [Clouds, James George & Jonathan Minard](https://medium.com/volumetric-filmmaking/spatialstorytelling-fa4b6ace3e16)
- [Volumetric filmaking](https://medium.com/volumetric-filmmaking/the-brief-history-of-volumetric-filmmaking-32b3569c6831)
- [Problem with glossy objects](https://sketchfab.com/3d-models/photogrammetry-paddles-comparsion-afb8b00764484a21a0ed7f674c727fb8)

<a name="#scan-ambients"/>

## 3D scan of external ambients.

</a>

- How to scan an external ambient using a photocamera.
- How to get a 3D model from a file video

### Resources/Inspiration:
- [Shining 360 by Claire Hentschker](http://www.clairesophie.com/shining360excerpt)

### Class activities:
- Organize a navigation path inside a 3D scanned space.


<a name="#elaboration"/>

## 3D scanned model elaboration.

</a>

- Apply materials to the model using Blender.
- From points to 3D surfaces using [MeshLab](https://en.wikipedia.org/wiki/MeshLab)
- Video exporting in blender.

<a name="#navigation"/>

## Navigation.

</a>

- Camera movements inside 3D spaces.
- Multiple views, camera parenting, camera on a 3D path.

### Resources/Inspiration
- [Moving Cameras and Point of View by Golan Levin](https://github.com/golanlevin/ExperimentalCapture/blob/master/docs/moving-cameras.md)
- [Tezuka Osamu, 1984](https://www.youtube.com/watch?v=_1pThwh2Ves)
- [Firewatch](https://www.firewatchgame.com/)
- [Walking Simulator, definition](https://tvtropes.org/pmwiki/pmwiki.php/Main/EnvironmentalNarrativeGame?from=Main.WalkingSimulator)
- [History of Walking Simulator](https://www.youtube.com/watch?time_continue=2&v=iDjkWxYD298)
- [History of Walking Simulator 2]((https://www.salon.com/2017/11/11/a-brief-history-of-the-walking-simulator-gamings-most-detested-genre/)
- [Ian MacLarty, Forests are for Trees](https://ianmaclarty.itch.io/forests-are-for-trees)
- [Ian MacLarty, The Catacombs of Solaris](https://ianmaclarty.itch.io/catacombs-of-solaris)
- [Ian MacLarty, SouthBank Portrait](https://ianmaclarty.itch.io/southbank-portrait)
- [Ian MacLarty, Black Hole Interior Explorer](https://ianmaclarty.itch.io/black-hole-interior-explorer)
- [Julius Von Bismarck, topshot helmet](http://juliusvonbismarck.com/bank/index.php?/projects/topshot-helmet/)
- [WORLD4](https://alexandermuscat.itch.io/world4)


#### Metashape basics
- Preferences, turn on GPU if you have one. Where to change theme and background colors.
- Import some pictures.
- Select Add Photos... command from the Workflow menu or click  Add Photos toolbar button onthe Workspace pane
- In  the  Add  Photos  dialog  box  browse  to  the  folder  containing  the  images  and  select  files  to  beprocessed. Then click Open button
Selected images will appear on the Workspace panel
- Workflow -> align photos. Go with the default. It will take a while.
- If necessary, resize the bounding box around the generated point cloud. Once you are done: Workflow -> build dense point cloud. A dense point cloud is necessary in case you want to build a mesh.
- workflow build mesh.
- workflow build texture.
- Export -> model -> check png, disable vertex color.
- Blender -> Import obj.


