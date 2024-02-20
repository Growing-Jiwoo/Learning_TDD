import { render, screen } from "../../../test-utils/testing-library-utils";
import { server } from "../../../mocks/server";
import { HttpResponse, http } from "msw";
import OrderConfirmation from "../OrderConfirmation";

// 주문을 추출하고 서버로부터 오류 응답을 받았을 때 경고 표시
// 오류 응답 핸들러로 교체하는 연습, Options에서 오류 응답 받았을 때 처럼

test("주문을 추출하고 서버로부터 오류 응답을 받았을 때 경고 표시", async () => {
  server.resetHandlers(
    http.post("http://localhost:3030/order", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderConfirmation />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});
