def get_model(request):
    param = request.query_params.get('model')
    print(param)
    model = app_data[param]
    if model:
        print(model)
        return model['model']
    else:
        return None


def get_serializer(request):
    model_name = request.query_params.get('model')
    try:
        model = app_data[model_name]
        if model:
            return model['serializer']
    except:
        return None


def get_table(request):
    model_name = get_model(request)
    if model_name:
        print(model_name, 'get_table')
        return model_name
    return None


class PutAPI(RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]

    def model(self):
        model_name = get_model(self.request)
        if model_name:
            return model_name
        return None

    def get_serializer_class(self):
        try:
            serializer = get_serializer(self.request)
            if serializer is not None:
                return serializer
            return NullSerializer
        except:
            return None

    def get_queryset(self):
        model = self.model()
        if model:
            table = get_table(model)
            queryset = table.objects.all()
            return queryset
        else:
            return None

    def retrieve(self, request, pk):
        try:
            serializer = self.get_serializer_class()
            print(serializer)
            if serializer is not None:
                table = self.model()
                queryset = get_object_or_404(table, id=pk)
                serialize = serializer(queryset)
                return Response(serialize.data)
            else:
                print('No model exist')
                return Response({"status": "No Product", }, status=HTTP_206_PARTIAL_CONTENT)
        except Exception as e:
            return Response({"status": f"No Model Named {str(e)}"}, status=HTTP_206_PARTIAL_CONTENT)

        #  def update(self, request, pk):
    #     try:
    #         model = self.model()
    #         product = get_object_or_404(model, id=pk)
    #         get_serializer = self.get_serializer_class()
    #         if get_serializer is not None:
    #             serializer = get_serializer(product, request.data)
    #             if serializer.is_valid():
    #                 serializer.save()
    #                 return Response(serializer.data, status=HTTP_200_OK)
    #         return Response({'status': 'failure', 'data': 'None'}, status=HTTP_206_PARTIAL_CONTENT)
    #     except Exception as e:
    #         return Response({'status': 'failure', 'data': str(e)}, status=HTTP_206_PARTIAL_CONTENT)

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     print(instance)
    #     self.perform_destroy(instance)
    #     return Response(status=HTTP_200_OK)

# def get_queryset(id):
#     pk=id
#     table = get_table()
#     if table:
#         queryset = table.objects.get(id=pk)
#         return queryset
#     return None
