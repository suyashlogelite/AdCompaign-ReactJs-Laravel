<?php

namespace App\Http\Controllers\Api;

use App\Models\Images;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{
    public function view()
    {
        $category_data = Banner::all();
        $images_data = Images::all();
        if ($category_data->count() > 0 || $images_data->count() > 0) {

            return response()->json(
                [
                    'status' => 200,
                    'data' => ['categoryData' => $category_data, 'imageData' => $images_data]
                ]
            );
        } else {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'No Record Found'
                ]
            );
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|unique:banner|min:3",
            "category" => "required",
            "image1" => "mimes:jpg,jpeg,png,gif|max:10000",
            "image2" => "mimes:jpg,jpeg,png,gif|max:10000",
            "image3" => "mimes:jpg,jpeg,png,gif|max:10000",
            "image4" => "mimes:jpg,jpeg,png,gif|max:10000",
            "image5" => "mimes:jpg,jpeg,png,gif|max:10000",
            "image6" => "mimes:jpg,jpeg,png,gif|max:10000"
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 422,
                    'message' => "Please fix the errors",
                    'errors' => $validator->errors()
                ],
                422
            );
        }

        $banner = new Banner;
        $images = new Images;

        $banner->title = $request->title;
        $banner->category = $request->category;
        $banner->save();

        $imageAll = ["image1", "image2", "image3", "image4", "image5", "image6"];
        $path = [];
        foreach ($imageAll as $index => $imageVal) {
            if ($request->hasFile($imageVal)) {
                $img = $request->file($imageVal);
                $ext = $img->getClientOriginalExtension();
                $imageName = time() . '_' . $index . '_' . '.' . $ext;
                $img->move(public_path() . '/images/', $imageName);
                $path = asset('/images/' . $imageName);
                $images->$imageVal = $path;
            }
        }

        $images->save();

        return response()->json([
            'status' => 200,
            'message' => "Record Inserted Successfully",
            'data' => [
                'banner' => $banner,
                'images' => $images,
            ],
        ], 200);
    }

    public function destroy($id)
    {
        $image = Images::find($id);
        $banner = Banner::find($id);

        if (!$image && !$banner) {
            return response()->json([
                "status" => false,
                "message" => "Data Not Found"
            ], 404);
        }

        $image->delete();
        $banner->delete();

        foreach (range(1, 6) as $index) {
            $columnName = "image{$index}";
            $imageUrl = $image->$columnName;

            $filename = basename($imageUrl);
            $fullpath = public_path('images/' . $filename);

            if (file_exists($fullpath) && is_file($fullpath)) {
                unlink($fullpath);
            }
        }

        return response()->json([
            "status" => true,
            "message" => "Data Deleted Successfully"
        ], 200);
    }

    public function status($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json([
                "status" => 404,
                "message" => "Banner not found"
            ], 404);
        }

        $status = $banner->status;

        // Toggle the status
        $newStatus = $status === "1" ? "0" : "1";
        $banner->status = $newStatus;
        $banner->save();

        return response()->json([
            "status" => 200,
            "data" => $newStatus,
            "message" => "Status Updated"
        ], 200);
    }

    public function show($id)
    {
        $Images = Images::find($id);
        $Banner = Banner::find($id);
        if ($Images || $Banner) {
            return response()->json([
                'status' => 200,
                'banner' => $Banner,
                'images' => $Images
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'message' => "No Such Record found"
            ], 404);
        }
    }

    public function edit($id)
    {
        $Images = Images::find($id);
        $Banner = Banner::find($id);
        if ($Images || $Banner) {
            return response()->json([
                'status' => 200,
                'banner' => $Banner,
                'images' => $Images
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'message' => "No Such Record found"
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|min:3",
            "category" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        } else {
            $banner = Banner::find($id);
            $images = Images::find($id);

            $banner->title = $request->title;
            $banner->category = $request->category;
            $banner->save();

            $imageAll = ["image1", "image2", "image3", "image4", "image5", "image6"];
            $path = [];

            foreach ($imageAll as $index => $imageColumn) {
                if ($request->hasFile($imageColumn)) {
                    $validationRules = [
                        $imageColumn => 'image|mimes:jpeg,png,jpg,gif|max:5000',
                    ];
                    $validator = Validator::make($request->only($imageColumn), $validationRules);
                    if ($validator->fails()) {
                        return response()->json([
                            'status' => 422,
                            'errors' => $validator->messages()
                        ], 422);
                    }

                    $img = $request->file($imageColumn);
                    $ext = $img->getClientOriginalExtension();
                    $imageName = time() . '_' . $index . '_' . '.' . $ext;
                    $img->move(public_path() . '/images/', $imageName);
                    $path[$imageColumn] = asset('/images/' . $imageName);
                    if ($images->$imageColumn != null) {
                        $oldImagePath = public_path() . '/images/' . basename($images->$imageColumn);
                        unlink($oldImagePath);
                    }
                } else {
                    $images->$imageColumn = $request->$imageColumn;
                }
            }

            $images->fill($path);
            $images->save();

            return response()->json([
                'status' => 200,
                'message' => "Record Updated Successfully",
                'data' => [
                    'banner' => $banner,
                    'images' => $images,
                ],
            ], 200);
        }
    }
}
