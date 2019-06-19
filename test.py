from django.test import TestCase

class Test(TestCase):
    def test_index(self):
        response = self.client.get('/')
        print(response)
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    Test.main()
